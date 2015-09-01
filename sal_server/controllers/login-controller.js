var Logger = require('../logging').logger();

exports.getLoggedInUser = function(request) {
    Logger.info('LoginController', 'getLoggedInUser', 'Invocation of getLoggedInUser().');
    if(!request) {
        throw Error('Request is required to determine the logged in user.');
    }
    return (request.user) ? request.user : null;
};