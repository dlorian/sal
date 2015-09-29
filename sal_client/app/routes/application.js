import AuthenticationRoute from './authentication';

export default AuthenticationRoute.extend({
    error: false,

    showUnauthorized: function(error) {
        this.controllerFor('login').destroyLoggedInUser();
        this.renderErrorTemplate('error.unauthorized');
    },

    showError: function(error) {
        this.renderErrorTemplate('error.error');
    },

    renderErrorTemplate: function(templateName) {
        //{model: error}
        this.render(templateName, { into: 'application' });
    },

    actions: {
        willTransition: function(transition) {
            if(this.get('error')) {
                this.disconnectOutlet({parentView: 'application'});
                this.set('error', false);
            }

            return true;
        },

        error: function(error) {
            if(errror.errors) {
                var serverError = error.errors[0];

                if (serverError && serverError.status == 401) {
                    this.set('error', true);
                    this.showUnauthorized(serverError);
                }
                else {
                    this.showError(serverError);
                }
            }
        }
    }
});