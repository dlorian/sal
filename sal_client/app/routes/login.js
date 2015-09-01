import Ember from 'ember';
import AuthenticationRoute from './authentication';

// Extend from AuthenticationRoute to make sure that user is authenticated.
export default AuthenticationRoute.extend({
    setupController: function(controller) {
        controller.reset();
    }
});