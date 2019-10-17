import Service from '@ember/service';
import { set } from '@ember/object';

const GHIBLI_API_MOVIE_FETCH_URL = 'https://ghibliapi.herokuapp.com/films'

// See https://guides.emberjs.com/release/tutorial/service/
export default Service.extend({
  init() {
    if (!Array.isArray(this.movieList)) {
      set(this, 'movieList', []);
    }

    this._super(...arguments);
  },
  async getMovieList() {
    if (this.movieList.length === 0) {
      const response = await fetch(GHIBLI_API_MOVIE_FETCH_URL)
      this.movieList = await response.json()
    }

    return this.movieList
  },
});
