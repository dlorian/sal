import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function() {
    this.route('login');

    this.route('running', { path: '/running' }, function() {
      this.route('new');
    });

    this.route('cycling', { path: '/cycling' }, function() {
        this.route('new');
    });
});

export default Router;