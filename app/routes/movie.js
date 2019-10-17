import Route from '@ember/routing/route';
import { inject as service } from '@ember/service'

export default Route.extend({
  movieDetail: service(),
  model(param) {
    if (param.id == null) {
      this.transitionTo('index');
    }

    return this.movieDetail.getMovie(param.id)
  }
});
