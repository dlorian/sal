import Ember from 'ember';

export default Ember.Controller.extend(Ember.Evented, {
    /**
     * Inject required login controller
     * @type {[type]}
     */
    login: Ember.inject.controller(),

    /**
     * Stores state if the controller is initialized or not. Initlizead means that
     * the logged in state was loaded from the server.
     *
     * @type {Boolean}
     */
    initialized: false,

    /**
     * Stores the error message returned by the server when checking logged in
     * state of the user.
     * @type {String}
     */
    errorMessage: null,

    loggedInUser: function() {
        return this.get('login.loggedInUser');
    }.property('login.loggedInUser'),

    init: function() {
        var me = this;

        // Check if the user is still logged in via session cookie
        this.get('login').checkLoggedIn({
            success: function(loggedInUser) {
                if(loggedInUser.isLoggedIn) {
                    if (SalClient.Router.attemptedTransition) {
                        SalClient.Router.attemptedTransition.retry();
                        SalClient.Router.attemptedTransition = null;
                    }
                }

                // Mark the application as initialized to show outlet
                me.set('initialized', true);
            },
            failure: function() {
                me.set('errorMessage', 'Beim Laden der Anmeldeinformationen ist ein Fehler aufgetreten.');
            }
        });
    },

    redirectToLogin: function(transition) {
        // Save the transition for redirecting after a successfull login
        this.set('login.attemptedTransition', transition);
        this.transitionToRoute('login');
    },

    actions: {
        login: function() {
            var transition = this.get('target.router.activeTransition');
            this.redirectToLogin(transition);
        },
        logout: function() {
            this.get('login').doLogout();
        }
    }
});
