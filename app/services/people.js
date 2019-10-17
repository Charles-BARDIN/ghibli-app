import Service from '@ember/service';
import { set } from '@ember/object';

const GHIBLI_API_PEOPLE_FETCH_URL = 'https://ghibliapi.herokuapp.com/people'
const GHIBLI_API_SPECIES_FETCH_URL = 'https://ghibliapi.herokuapp.com/species'

export default Service.extend({
  init() {
    if (!Array.isArray(this.peopleList)) {
      set(this, 'peopleList', []);
    }

    if (!Array.isArray(this.speciesList)) {
      set(this, 'speciesList', []);
    }

    this._super(...arguments);
  },
  async getByIDs(ids) {
    // TODO:
  },
  async _getPeopleList() {
    if (this.speciesList.length === 0) {
      const response = await fetch(GHIBLI_API_SPECIES_FETCH_URL)
      this.speciesList = await response.json()
    }

    if (this.peopleList.length === 0) {
      const response = await fetch(GHIBLI_API_PEOPLE_FETCH_URL)
      const rawPeopleList = await response.json()

      this.peopleList = rawPeopleList.map(people => {
        // TODO: attach species to get name and films
      })
    }

    return this.peopleList
  }
});
