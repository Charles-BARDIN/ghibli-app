import Service from '@ember/service';
import { set } from '@ember/object';

const GHIBLI_API_VEHICLE_FETCH_URL = 'https://ghibliapi.herokuapp.com/vehicles'

export default Service.extend({
  init() {
    if (!Array.isArray(this.vehicleList)) {
      set(this, 'vehicleList', []);
    }

    this._super(...arguments);
  },
  async getByIDs(ids) {
    // TODO:
  },
  async _getVehicleList() {
    if (this.vehicleList.length === 0) {
      const response = await fetch(GHIBLI_API_VEHICLE_FETCH_URL)
      const rawVehicleList = await response.json()

      this.vehicleList = rawVehicleList.map(vehicle => {
        // TODO: attach pilot and films
      })
    }

    return this.vehicleList
  }
});
