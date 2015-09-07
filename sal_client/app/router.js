import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function() {
  this.route('login');

  this.route('running', { path: '/running' }, function() {
    this.route('details', { path: '/:id'});
    this.route('new');
    this.route('list');
  });

  this.route('cycling', { path: '/cycling' }, function() {
      this.route('details', { path: '/:id'});
      this.route('new');
      this.route('list');
  });
});

export default Router;