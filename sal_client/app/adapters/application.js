import Ember from 'ember';
import Application from '../custom/application';

export default DS.RESTAdapter.extend({
    namespace: Ember.computed(function() {
        var app = new Application();
        return app.getNamespace();
    }),
    //namespace: window.SAL_CLIENT.APP.namespace, // Defines the path for backend services
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
    shouldReloadAll: function() {
        return true;
    }
});
