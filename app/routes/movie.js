import Route from '@ember/routing/route';

export default Route.extend({
  model(param) {
    if (param.id == null) {
      this.transitionTo('index');
    }
  }
});
