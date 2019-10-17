import Service from '@ember/service';
import { set } from '@ember/object';

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
        return await response.json()
      }

      this._recoverPromise = recovery()

      this.movieList = await this._recoverPromise

      this._isRecovering = false
      this._recoverPromise = undefined
    }

    return this.movieList
  },
  async getByIDs(ids) {
    const movies = await this.getMovieList()

    return movies.filter(m => ids.includes(m.id))
  }
});
