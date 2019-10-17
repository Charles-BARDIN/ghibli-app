import Service, { inject as service } from '@ember/service';
import { set } from '@ember/object';

export default Service.extend({
  movie: service(),
  people: service(),
  location: service(),
  vehicle: service(),
  _isRecovering: false,
  _recoverPromise: undefined,
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
    if (this._isRecovering) {
      return this._recoverPromise
    }

    if (this.movieDetails.length === 0) {
      this._isRecovering = true

      const recovery = async () => {
        const movies = await this.movie.getMovieList()

        const promises = []
        movies
          .forEach(movie => promises.push(this._attachEntitiesToMovie(movie)))

        return await Promise.all(promises)
      }

      this._recoverPromise = recovery()

      this.movieDetails = await this._recoverPromise

      this._isRecovering = false
      this._recoverPromise = undefined
    }

    return this.movieDetails
  },
  async _attachEntitiesToMovie(movie) {
    const promises = [
      this._attachPeopleToMovie(movie),
      this._attachLocationsToMovie(movie),
      this._attachVehiclesToMovie(movie),
    ]

    await Promise.all(promises)

    return movie
  },
  async _attachPeopleToMovie(movie) {
    const people = await this.people.getByMovieID(movie.id)
    movie.people = (people || [])
      .map(p => {
        return {
          id: p.id,
          name: p.name,
        }
      })
    return movie
  },
  async _attachLocationsToMovie(movie) {
    const locations = await this.location.getByMovieID(movie.id)
    movie.locations = (locations || [])
      .map(l => {
        return {
          id: l.id,
          name: l.name,
        }
      })
    return movie
  },
  async _attachVehiclesToMovie(movie) {
    const vehicles = await this.vehicle.getByMovieID(movie.id)
    movie.vehicles = (vehicles || [])
      .map(v => {
        return {
          id: v.id,
          name: v.name,
        }
      })
    return movie
  },
});
