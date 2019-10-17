import Service, { inject as service } from '@ember/service';
import { set } from '@ember/object';

import { getSpecieIDFromURL, getMovieIDFromURL, removeTODOFromReceivedData } from '../helpers'

const GHIBLI_API_PEOPLE_FETCH_URL = 'https://ghibliapi.herokuapp.com/people'
const GHIBLI_API_SPECIES_FETCH_URL = 'https://ghibliapi.herokuapp.com/species'

export default Service.extend({
  movie: service(),
  _isRecovering: false,
  _recoverPromise: undefined,
  init() {
    if (!Array.isArray(this.peopleList)) {
      set(this, 'peopleList', []);
    }

    if (!Array.isArray(this.speciesList)) {
      set(this, 'speciesList', []);
    }

    this._super(...arguments);
  },
  async getByIDs(id) {
    const people = await this._getPeopleList()

    return people.filter(p => id.includes(p.id))
  },
  async getByID(id) {
    const people = await this._getPeopleList()

    return people.find(p => id.includes(p.id))
  },
  async getByMovieID(movieID) {
    const people = await this._getPeopleList()

    return people
      .filter(people => {
        const movieIDs = people.films
          .map(m => m.id)

        return movieIDs.includes(movieID)
      })
  },
  async _getPeopleList() {
    if (this._isRecovering) {
      return this._recoverPromise
    }

    if (this.peopleList.length === 0 || this.speciesList.length === 0) {
      this._isRecovering = true

      const recovery = async () => {
        const _response = await fetch(GHIBLI_API_SPECIES_FETCH_URL)
        this.speciesList = removeTODOFromReceivedData(await _response.json())

        const response = await fetch(GHIBLI_API_PEOPLE_FETCH_URL)
        const rawPeopleList = removeTODOFromReceivedData(await response.json())

        const promises = []

        rawPeopleList
          .forEach(people => {
            const specieID = getSpecieIDFromURL(people.species)

            const specie = this.speciesList.find(spe => spe.id === specieID)

            people.species = {
              id: specie.id,
              name: specie.name,
            }

            const movieIDs = people.films
              .map(getMovieIDFromURL)
              .filter(id => id != null)
            promises.push(this._attachMovieToPeople(people, movieIDs))
          })

        return await Promise.all(promises)
      }

      this._recoverPromise = recovery()

      this.peopleList = await this._recoverPromise

      this._isRecovering = false
      this._recoverPromise = undefined
    }

    return this.peopleList
  },
  async _attachMovieToPeople(people, ids) {
    const movies = await this.movie.getByIDs(ids)
    people.films = movies
      .map(m => {
        return {
          id: m.id,
          title: m.title,
        }
      })

    return people
  },
});
