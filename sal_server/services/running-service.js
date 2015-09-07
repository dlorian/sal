// Import running controller
var runningController = require('../controllers/running-controller');

// Import login controller
var loginController = require('../controllers/login-controller');

// Import Logger
var Logger = require('../logging').logger();

exports.addRunning = function(request, response) {
    Logger.info('RunningService', 'addRunning', 'Invocation of addRunning().');

    var user  = loginController.getLoggedInUser(request);

    var newRunning = request.body.running;

    runningController.createRunning(newRunning, user, function(err, running){
        if(err) {
            Logger.error('RunningService', 'addRunning', 'Error while adding running. Sending error response.');
            // Send error
            return response.send({success: false});
        }
        Logger.info('RunningService', 'addRunning', 'Running added. Sending response.');
        return response.send({running: running});
    });
};

exports.updateRunning = function(request, response) {
    Logger.info('RunningService', 'updateRunning', 'Invocation of updateRunning().');

    var user  = loginController.getLoggedInUser(request);

    var updatedRunning = request.body.running, id = request.params.id;

    runningController.updateRunning(id, updatedRunning, user, function(err, running) {
        if(err) {
            Logger.error('RunningService', 'updateRunning', 'Error while updating running. Sending error response.');
            // Send error
            return response.send({success: false});
        }
        Logger.info('RunningService', 'updateRunning', 'Running updated. Sending response.');
        return response.send({running: running});
    });
}

exports.getRunning = function(request, response) {
    Logger.info('RunningService', 'getRunning', 'Invocation of getRunning().');
    var id = request.params.id;

    runningController.getRunning(id, function(err, running) {
        if(err) {
            Logger.error('RunningService', 'getRunning', 'Error while getting running. Sending error response.');
            // Send error
            return response.send({success: false});
        }
        Logger.info('RunningService', 'getRunning', 'Running found. Sending response.');
        return response.send({running: running});
    });
};

exports.getRunnings = function(request, response) {
    Logger.info('RunningService', 'getRunnings', 'Invocation of getRunnings().');

    runningController.getRunnings(request.query, function(err, runnings) {
        if(err) {
            Logger.error('RunningService', 'getRunnings', 'Error while getting running. Sending error response.');
            // Send error
            return response.send({success: false});
        }
        Logger.info('RunningService', 'getRunnings', 'Runnings found. Sending response.');
        return response.send({runnings: runnings});
    });
}
