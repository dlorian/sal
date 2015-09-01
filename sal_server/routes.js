var loginService = require('./services/login-service');

module.exports = function(app, passport) {
    // Set up Login route
    // GET and POST for login should be the only routes where a user does not have to be logged in.
    app.route('/api/login')
        .get(function(req, res, next)  {
            loginService.isLoggedIn(req, res, next, passport);
        })
        .post(function(req, res, next) {
            loginService.loginUser(req, res, next, passport);
        })
    ;

    // # NOTE #
    // Make sure that user is logged in for all following routes
    app.all('/api/*', loginService.isAuthenticated);

    // Set up logout route
    app.route('/api/logout').post(function(req, res, next) {
        loginService.logoutUser(req, res, next, passport);
    });
};