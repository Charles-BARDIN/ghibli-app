import Service, { inject as service } from '@ember/service';
import { set } from '@ember/object';

import { getMovieIDFromURL, getPeopleIDFromURL, removeTODOFromReceivedData } from '../helpers'

const GHIBLI_API_VEHICLE_FETCH_URL = 'https://ghibliapi.herokuapp.com/vehicles'

export default Service.extend({
  people: service(),
  movie: service(),
  _isRecovering: false,
  _recoverPromise: undefined,
  init() {
    if (!Array.isArray(this.vehicleList)) {
      set(this, 'vehicleList', []);
    }

    this._super(...arguments);
  },
  async getByIDs(ids) {
    const vehicles = await this._getVehicleList()

    return vehicles.filter(v => ids.includes(v.id))
  },
  async getByMovieID(movieID) {
    const vehicle = await this._getVehicleList()

    return vehicle
      .filter(vehi => {
        const _movieID = getMovieIDFromURL(vehi.films)

        return _movieID === movieID
      })
  },
  async _getVehicleList() {
    if (this._isRecovering) {
      return this._recoverPromise
    }

    if (this.vehicleList.length === 0) {
      this._isRecovering = true

      const recovery = async () => {
        const response = await fetch(GHIBLI_API_VEHICLE_FETCH_URL)
        const rawVehicleList = removeTODOFromReceivedData(await response.json())

        const promises = []

        rawVehicleList
          .forEach(vehicle => promises.push(this._attachEntitiesToVehicle(vehicle)))

        return await Promise.all(promises)
      }

      this._recoverPromise = recovery()

      this.vehicleList = await this._recoverPromise

      this._isRecovering = false
      this._recoverPromise = undefined
    }

    return this.vehicleList
  },
  async _attachEntitiesToVehicle(vehicle) {
    const promises = []

    const movieID = getMovieIDFromURL(vehicle.films)
    promises.push(this._attachMovieToVehicle(vehicle, movieID))

    const peopleID = getPeopleIDFromURL(vehicle.pilot)
    promises.push(this._attachPilotToVehicle(vehicle, peopleID))

    await Promise.all(promises)

    return vehicle
  },
  async _attachMovieToVehicle(vehicle, id) {
    const movies = await this.movie.getByIDs([id])
    vehicle.movies = (movies || [])
      .map(m => {
        return {
          id: m.id,
          title: m.title,
        }
      })[0]

    return vehicle
  },
  async _attachPilotToVehicle(vehicle, id) {
    const people = await this.people.getByIDs([id])
    vehicle.pilot = (people || [])
      .map(p => {
        return {
          id: p.id,
          name: p.name,
        }
      })[0]

    return vehicle
  }
});
