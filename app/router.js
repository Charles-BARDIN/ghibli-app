import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function () {
  this.route('movies');
  this.route('not-found', { path: '/*path' });
  this.route('movie', { path: '/movie/:id' });
  this.route('people', { path: '/people/:id' });
  this.route('location', { path: '/location/:id' });
  this.route('vehicle', { path: '/vehicle/:id' });
});

export default Router;
