import Ember from 'ember';
import Application from '../custom/application';

export default Ember.Controller.extend({

    /**
     * Stores the state if controller is already initalized
     * @type {Boolean}
     */
    initialized: false,

    /**
     * Stores information of a current logged in user.
     * @type {Object}
     */
    loggedInUser: { user: null, isLoggedIn: false },

    /**
     * Stores the state if the controller attempts to login in a user
     * @type {Boolean}
     */
    isLoggingIn: false,

    /**
     * Stores the error message returned by the server when checking logged in
     * state of the user.
     * @type {String}
     */
    errorMessage: null,

    appNamespace: Ember.computed(function() {
        var app = new Application();
        return app.getNamespace();
    }),

    /**
     * Check if the user is still logged via a session cookie.
     * @param {Object} config object with success and failure callback properties.
     */
    checkLoggedIn: function(config) {
        var me      = this,
            success = config.success,
            failure = config.failure;

        // if login controller is already intialized return current loggedin user
        if(me.get('initialized') === true) {
            if (success && typeof(success) === "function") {
                success(me.get('loggedInUser'));
            }
            return;
        }

        var successCallback = function(response) {
            if(response.success === true) {
                var user = me.get('store').createRecord('User', response.user);
                me.set('loggedInUser', { isLoggedIn: true, user: user });
            }

            me.set('initialized', true);

            if (success && typeof(success) === "function") {
                success(me.get('loggedInUser'));
            }
        };

        this.getLogin(successCallback, failure);
    },

    reset: function() {
        this.setProperties({ 'username': null, 'password': null });
    },

    getLogin: function(success, failure) {
        Ember.$.get('api/login').done(function(response) {
            if (success && typeof(success) === "function") {
                success(response);
            }
        }).fail(function() {
            if (failure && typeof(failure) === "function") {
                failure({errMsg: 'Error while loading.'});
            }
        });
    },

    doLogin: function() {
        var me = this, i, hashedPassword;
        // Delete exisitng error message before login attempt
        me.set('errorMessage', null);
        me.set('isLoggingIn', true);

        // Immediately hash password of user
        hashedPassword = this.get('password');
        for(i = 0; i < 100; i++) {
            hashedPassword = CryptoJS.SHA3(hashedPassword).toString();
        }

        var data = {
            username: this.get('username'),
            password: hashedPassword
        };

        // Do login request
        Ember.$.post('api/login', data).done(function(response) {
            if(response.success === true) {
                var user = me.get('store').createRecord('User', response.user);
                me.set('loggedInUser', { isLoggedIn: true, user: user });
                if (SalClient.Router.attemptedTransition) {
                    var attemptedTransition = SalClient.Router.attemptedTransition;
                    attemptedTransition.retry();
                    me.set('attemptedTransition', null);
                }
                else {
                    me.transitionToRoute('index');
                }
            }
            else {
                var errText = response.msg || 'Bei der Anmeldung ist ein Fehler aufgetreten.';
                me.set('errorMessage', errText);
            }
        }).fail(function() {
            // login failure
            me.set('errorMessage', 'Es ist ein Fehler aufgetreten.');
        }).always(function() {
            // hide loader always
            me.set('isLoggingIn', false);

            // Clear user data
            me.set('username', null);
            me.set('password', null);

            // Clear data of login request
            data = undefined;
        });
    },

    doLogout: function() {
        var me = this;

        Ember.$.post('api/logout').done(function() {
            me.transitionToRoute('login');
            me.destroyLoggedInUser();

        }).fail(function(error) {
            // Only redirect to 401 if user not authenticated
            if(error.status === 401) {
                me.transitionToRoute('login');
                me.destroyLoggedInUser();
            }
            else {
                me.set('errorMessage', 'Es ist ein Fehler beim Logout aufgetreten.');
            }
        });
    },

    destroyLoggedInUser: function() {
        var user = this.get('loggedInUser.user');
        if(user) {
            user.destroyRecord();
        }
        this.set('loggedInUser', {isLoggedIn: false, user: null });
    },

    actions: {
        login: function() {
            this.doLogin();
        }
    }
});
