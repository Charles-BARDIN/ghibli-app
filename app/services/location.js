import Service from '@ember/service';
import { set } from '@ember/object';

const GHIBLI_API_LOCATION_FETCH_URL = 'https://ghibliapi.herokuapp.com/locations'

export default Service.extend({
  init() {
    if (!Array.isArray(this.locationsList)) {
      set(this, 'locationsList', []);
    }

    this._super(...arguments);
  },
  async getByIDs(ids) {
    // TODO:
  },
  async _getLocationsList() {
    if (this.locationsList.length === 0) {
      const response = await fetch(GHIBLI_API_LOCATION_FETCH_URL)
      const rawLocationsList = await response.json()

      this.locationsList = rawLocationsList
        .map(loc => {
          // TODO: attach people and films
        })
    }

    return this.locationsList
  }
});
