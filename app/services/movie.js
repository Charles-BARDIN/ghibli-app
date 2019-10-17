import Service from '@ember/service';
import { set } from '@ember/object';

import { removeTODOFromReceivedData } from '../helpers'
import movie from '../routes/movie';

const GHIBLI_API_MOVIE_FETCH_URL = 'https://ghibliapi.herokuapp.com/films'

// See https://guides.emberjs.com/release/tutorial/service/
export default Service.extend({
  _isRecovering: false,
  _recoverPromise: undefined,
  init() {
    if (!Array.isArray(this.movieList)) {
      set(this, 'movieList', []);
    }

    this._super(...arguments);
  },
  async getMovieList() {
    if (this._isRecovering) {
      return this._recoverPromise
    }

    if (this.movieList.length === 0) {
      this._isRecovering = true

      const recovery = async () => {
        const response = await fetch(GHIBLI_API_MOVIE_FETCH_URL)
        const moviesSeen = localStorage.getItem('movies-seen') || []

        const result = (await response.json())
          .map(movie => {
            movie.seen = moviesSeen.includes(movie.id)
            return movie
          })

        return removeTODOFromReceivedData(result)
      }

      this._recoverPromise = recovery()

      this.movieList = (await this._recoverPromise)
        .sort((a, b) => Number(a.release_date) - Number(b.release_date))

      this._isRecovering = false
      this._recoverPromise = undefined
    }

    return this.movieList
  },
  async getByIDs(ids) {
    const movies = await this.getMovieList()

    return movies.filter(m => ids.includes(m.id))
  },
  async getProducersList() {
    const movies = await this.getMovieList()

    return [...new Set(movies.map(m => m.producer))]
  },
  async getDirectorsList() {
    const movies = await this.getMovieList()

    return [...new Set(movies.map(m => m.director))]
  },
  async getMovieProducersAndDirectorsLists() {
    const [movies, directors, producers] = await Promise.all([
      this.getMovieList(),
      this.getDirectorsList(),
      this.getProducersList(),
    ])

    return {
      movies,
      directors,
      producers
    }
  },
  markAsSeen(movieID) {
    const movie = this.movieList.find(m => m.id === movieID)

    if (!movie) {
      return
    }

    movie.seen = true

    const moviesSeen = localStorage.getItem('movies-seen') || []
    moviesSeen.push(movieID)
    localStorage.setItem('movies-seen', moviesSeen)
  },
  markAsNotSeen(movieID) {
    const movie = this.movieList.find(m => m.id === movieID)

    if (!movie) {
      return
    }

    movie.seen = false
    const moviesSeen = localStorage.getItem('movies-seen') || []
    const _newMoviesSeen = moviesSeen.filter(id => id !== movieID)
    localStorage.setItem('movies-seen', _newMoviesSeen)
  },
});
