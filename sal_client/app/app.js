import Ember from 'ember';
import DS from 'ember-data';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

var App;

Ember.MODEL_FACTORY_INJECTIONS = true;


DS.RESTAdapter.reopen({
    namespace: 'api' // Defines the path for backend services
    // ajaxError: function(jqXHR) {
    //     if(jqXHR.status === 401) {
    //         // Workaround to logout user
    //         var loginController = Mealboard.__container__.lookup('controller:login');
    //         if(loginController) {
    //             loginController.destroyLoggedInUser();
    //         }

    //         Mealboard.Router.router.transitionTo('login');
    //     }
    // }
});

App = Ember.Application.extend({
    modulePrefix: config.modulePrefix,
    podModulePrefix: config.podModulePrefix,
    Resolver: Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;
