import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function(transition) {
        // Transition to login and index is allowed without to being logged in.
        if(transition.targetName === 'index' || transition.targetName === 'login') {
            return;
        }

        // Verify that the user is logged in.
        // If not, redirect to index for checking authentication state.
        var loginController = this.controllerFor('login');
        if(!loginController.get('loggedInUser.isLoggedIn')) {
            this.redirectToLogin(transition);
        }
    },

    redirectToLogin: function(transition) {
        SalClient.Router.attemptedTransition = transition;
        this.transitionTo('/login');
    }
});