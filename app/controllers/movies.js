import Controller from '@ember/controller';
import { inject as service } from '@ember/service'

export default Controller.extend({
  movie: service(),
  error: undefined,
  actions: {
    async goToRandomUnseenMovie() {
      const movieID = await this.movie.getRandomUnseenMovieID()

      if (movieID == null) {
        this.set('error', 'You have already seen all the movies !')
        return
      }

      this.transitionToRoute('movie', movieID)
    }
  }
});
