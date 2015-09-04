import AuthenticationRoute from '../authentication';

export default AuthenticationRoute.extend({
    model: function (params) {
        return this.get('store').findAll('cycling');
    },

    setupController: function(controller, model) {
        controller.set('model', model);
    }
});