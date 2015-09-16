import AuthenticationRoute from '../authentication';

export default AuthenticationRoute.extend({

    queryParams: {
        from: { refreshModel: true },
        to: { refreshModel: true }
    },

    model: function (params) {
        return this.get('store').query('cycling', params);
    }
});