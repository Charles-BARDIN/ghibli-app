import Route from '@ember/routing/route';
import { inject as service } from '@ember/service'

export default Route.extend({
  people: service(),
  model(param) {
    if (param.id == null) {
      this.transitionTo('index');
    }

    return this.people.getByID(param.id)
  }
});
