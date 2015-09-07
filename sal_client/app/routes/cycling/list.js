import AuthenticationRoute from '../authentication';

export default AuthenticationRoute.extend({
    model: function () {
        return this.get('store').findAll('cycling', { backgroundReload: false });
    }
});