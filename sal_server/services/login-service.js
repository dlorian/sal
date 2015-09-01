var Logger = require('../logging').logger();

// Import Login controller
var loginController = require('../controllers/login-controller');

// Import User model
var User = require('../models/user').getModel();

exports.isAuthenticated = function(request, response, next) {
    Logger.info('LoginService', 'isAuthenticated', 'Invocation of isAuthenticated().');

    Logger.info('LoginService', 'isAuthenticated', 'Check if user is authenticated.');
    if (request.isAuthenticated()) {
        Logger.info('LoginService', 'isAuthenticated', 'User '+request.user.username+' is authenticated.');
        return next();
    }
    else {
        Logger.error('LoginService', 'isAuthenticated', 'User is not authenticated.');
        return response.send("401 Unauthorized", 401);
    }
};

exports.isLoggedIn = function(request, response, next, passport) {
    Logger.info('LoginService', 'isLoggedIn', 'Invocation of isLoggedIn().');
    var me = this;

    Logger.info('LoginService', 'isLoggedIn', 'Check if user is authenticated.');
    if(request.isAuthenticated()) {
        Logger.info('LoginService', 'isLoggedIn', 'User "'+request.user.username+'" is authenticated.');

        // Get the user model for the current user.
        var user = loginController.getLoggedInUser(request);

        // Get user object with necesseray properties
        Logger.info('LoginService', 'isLoggedIn', 'User authenticated successfully.');
        response.json({ success: true, user: user});
    }
    else {
        Logger.info('LoginService', 'isLoggedIn', 'User is not authenticated.');
        response.json({ success: false, msg: 'Not logged in.' });
    }
}


exports.loginUser = function(request, response, next, passport) {
    Logger.info('LoginService', 'loginUser', 'Invocation of loginUser().');

    Logger.info('LoginService', 'loginUser', 'Try to authenticate user.');
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            Logger.error('LoginService', 'loginUser', 'Error while authenticating user "'+user.username+'".', err);
            next(err);
        }

        if (!user) {
            Logger.info('LoginService', 'loginUser', 'Authentication of user "'+user.username+'" failed.');
            response.json({ success: false, msg: 'Benutzername oder Passwort ist falsch.' });
        }
        else {
            // if authenticaiton was successfull, login in user
            Logger.info('LoginService', 'loginUser', 'Authentication of user "'+user.username+'" successfull.');
            Logger.info('LoginService', 'loginUser', 'Login user '+user.username+'.');

            request.login(user, function(err) {
                if (err) {
                    Logger.error('LoginService', 'loginUser', 'Error while login user "'+user.username+'".', err);
                    next(err);
                }

                Logger.info('LoginService', 'loginUser', 'Login of user "'+user.username+'" successfull.');
                response.json({ success: true, msg: 'Login erfolgreich.', user: user });
            });
        }
    })(request, response, next); // add next for error handling
};

exports.logoutUser = function(request, response, next, passport) {
    Logger.info('LoginService', 'logoutUser', 'Invocation of logoutUser().');
    request.logout();

    Logger.info('LoginService', 'loginUser', 'Logout of user successfull.');
    response.json({ success: true, msg: 'Logout erfolgreich.' });
}