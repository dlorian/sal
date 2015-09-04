import AuthenticationRoute from '../authentication';

export default AuthenticationRoute.extend({
    model: function (params) {
        return this.get('store').createRecord('cycling');
    },

    // setupController: function(controller, model) {
    //     controller.set('model', model);
    // },

    actions: {
        willTransition: function() {
            var model = this.get('controller').get('model');

            // Don't keep not saved records in store
            if(model.get('isNew')) {
                model.destroyRecord();
            }
        }
    }
});