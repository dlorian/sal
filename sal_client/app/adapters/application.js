import DS from 'ember-data';

export default DS.RESTAdapter.extend({
    namespace: 'api', // Defines the path for backend services
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
    shouldReloadAll: function( store, snapshot ) {
        return true;
    }
});
