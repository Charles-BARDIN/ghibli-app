import Service, { inject as service } from '@ember/service';
import { set } from '@ember/object';

import { getPeopleIDFromURL, getMovieIDFromURL, removeTODOFromReceivedData } from '../helpers'

const GHIBLI_API_LOCATION_FETCH_URL = 'https://ghibliapi.herokuapp.com/locations'

export default Service.extend({
  people: service(),
  movie: service(),
  _isRecovering: false,
  _recoverPromise: undefined,
  init() {
    if (!Array.isArray(this.locationsList)) {
      set(this, 'locationsList', []);
    }

    this._super(...arguments);
  },
  async getByIDs(ids) {
    const locations = await this._getLocationsList()

    return locations
      .filter(loc => ids.includes(loc.id))
  },
  async getByID(id) {
    const locations = await this._getLocationsList()

    return locations
      .find(loc => id.includes(loc.id))
  },
  async getByMovieID(movieID) {
    const location = await this._getLocationsList()

    return location
      .filter(loc => {
        const movieIDs = loc.films
          .map(getMovieIDFromURL)

        return movieIDs.includes(movieID)
      })
  },
  async _getLocationsList() {
    if (this._isRecovering) {
      return this._recoverPromise
    }

    if (this.locationsList.length === 0) {
      this._isRecovering = true

      const recovery = async () => {
        const response = await fetch(GHIBLI_API_LOCATION_FETCH_URL)
        const rawLocationsList = removeTODOFromReceivedData(await response.json())

        const promises = []

        rawLocationsList
          .forEach(loc => promises.push(this._attachEntitiesToLocation(loc)))

        return Promise.all(promises)
      }

      this._recoverPromise = recovery()

      this.locationsList = await this._recoverPromise

      this._isRecovering = false
      this._recoverPromise = undefined
    }

    return this.locationsList
  },
  async _attachEntitiesToLocation(loc) {
    const promises = []

    const peopleIDs = loc.residents
      .map(getPeopleIDFromURL)
      .filter(id => id != null)
    promises.push(this._attachPeopleToLocation(location, peopleIDs))

    const movieIDs = loc.films
      .map(getMovieIDFromURL)
      .filter(id => id != null)
    promises.push(this._attachMovieToLocation(location, movieIDs))

    await Promise.all(promises)

    return loc
  },
  async _attachPeopleToLocation(location, ids) {
    const people = await this.people.getByIDs(ids)
    location.residents = people
      .map(p => {
        return {
          id: p.id,
          name: p.name,
        }
      })

    return location
  },
  async _attachMovieToLocation(location, ids) {
    const movies = await this.movie.getByIDs(ids)
    location.films = movies
      .map(m => {
        return {
          id: m.id,
          title: m.title,
        }
      })

    return location
  },
});
