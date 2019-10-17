import Service, { inject as service } from '@ember/service';
import { set } from '@ember/object';

import { getPeopleIDFromURL, getLocationIDFromURL, getVehicleIDFromURL } from '../helpers'

export default Service.extend({
  movie: service(),
  people: service(),
  location: service(),
  vehicle: service(),
  init() {
    if (!Array.isArray(this.movieDetails)) {
      set(this, 'movieDetails', []);
    }

    this._super(...arguments);
  },
  async getMovie(id) {
    const movies = await this._getMovieDetails()

    return movies
      .find(movie => movie.id === id)
  },
  async _getMovieDetails() {
    if (this.movieDetails.length === 0) {
      const movies = await this.movie.getMovieList()

      const promises = []
      movies
        .forEach(movie => {
          const peopleIDs = movie.people
            .map(getPeopleIDFromURL)
            .filter(id => id != null)
          promises.push(this._attachPeopleToMovie(movie, peopleIDs))

          const locationsIDs = movie.locations
            .map(getLocationIDFromURL)
            .filter(id => id != null)
          promises.push(this._attachLocationsToMovie(movie, locationsIDs))

          const vehiclesIDs = movie.vehicles
            .map(getVehicleIDFromURL)
            .filter(id => id != null)
          promises.push(this._attachVehiclesToMovie(movie, vehiclesIDs))
        })

      this.movieDetails = await Promise.all(promises)
    }

    return this.movieDetails
  },
  async _attachPeopleToMovie(movie, ids) {
    const people = await this.people.getByIDs(ids)
    movie.people = people || []
    return movie
  },
  async _attachLocationsToMovie(movie, ids) {
    const locations = await this.location.getByIDs(ids)
    movie.locations = locations || []
    return movie
  },
  async _attachVehiclesToMovie(movie, ids) {
    const vehicles = await this.vehicle.getByIDs(ids)
    movie.vehicles = vehicles || []
    return movie
  },
});
