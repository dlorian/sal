import AuthenticationRoute from '../authentication';

export default AuthenticationRoute.extend({
    model: function (params) {
        debugger
        return this.get('store').find('cycling', params.id);
    }
});