import Component from '@ember/component';
import { inject as service } from '@ember/service'

export default Component.extend({
  movieService: service('movie'),
  actions: {
    markAsSeen(id) {
      this.get('movieService').markAsSeen(id)
    },
    markAsNotSeen(id) {
      this.get('movieService').markAsNotSeen(id)
    }
  }
});
