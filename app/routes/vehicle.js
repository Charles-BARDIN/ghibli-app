import Route from '@ember/routing/route';
import { inject as service } from '@ember/service'

export default Route.extend({
  vehicle: service(),
  model(param) {
    if (param.id == null) {
      this.transitionTo('index');
    }

    return this.vehicle.getByID(param.id)
  }
});
