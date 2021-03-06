import AuthenticationRoute from '../authentication';

export default AuthenticationRoute.extend({
    model: function (params) {
        return this.get('store').findRecord('running', params.id);
    }
});