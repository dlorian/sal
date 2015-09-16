import AuthenticationRoute from '../authentication';

export default AuthenticationRoute.extend({

    queryParams: {
        from: { refreshModel: true },
        to: { refreshModel: true }
    },

    model: function(params) {
        return this.get('store').query('cycling', params);
    },

    setupController: function(controller, model) {
        controller.set('model', model);

        // Setup the query params of the rout
        var from = controller.get('from');
        var to = controller.get('to');
        controller.set('from', from || moment().subtract(1, 'month').format('YYYY-MM-DD'));
        controller.set('to', to || moment().format('YYYY-MM-DD'));
    }
});