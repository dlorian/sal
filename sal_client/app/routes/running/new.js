import AuthenticationRoute from '../authentication';

export default AuthenticationRoute.extend({
    model: function () {
        return this.get('store').createRecord('running');
    },

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