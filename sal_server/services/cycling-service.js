// Import cycling controller
var cyclingController = require('../controllers/cycling-controller');

// Import login controller
var loginController = require('../controllers/login-controller');

// Import Logger
var Logger = require('../logging').logger();

exports.addCycling = function(request, response) {
    Logger.info('CyclingService', 'addCycling', 'Invocation of addCycling().');

    var user  = loginController.getLoggedInUser(request);

    var newCycling = request.body.cycling;

    cyclingController.createCycling(newCycling, user, function(err, cycling){
        if(err) {
            Logger.error('CyclingService', 'addCycling', 'Error while adding cycling. Sending error response.');
            // Send error
            return response.send({success: false});
        }
        Logger.info('CyclingService', 'addCycling', 'Cycling added. Sending response.');
        return response.send({cycling: cycling});
    });
};

exports.updateCycling = function(request, response) {
    Logger.info('CyclingService', 'updateCycling', 'Invocation of updateCycling().');

    var user  = loginController.getLoggedInUser(request);

    var updatedCycling = request.body.cycling, id = request.params.id;

    cyclingController.updateCycling(id, updatedCycling, user, function(err, cycling) {
        if(err) {
            Logger.error('CyclingService', 'updateCycling', 'Error while updating cycling. Sending error response.');
            // Send error
            return response.send({success: false});
        }
        Logger.info('CyclingService', 'updateCycling', 'Cycling updated. Sending response.');
        return response.send({cycling: cycling});
    });
}

exports.getCycling = function(request, response) {
    Logger.info('CyclingService', 'getCycling', 'Invocation of getCycling().');
    var id = request.params.id;

    cyclingController.getCycling(id, function(err, cycling) {
        if(err) {
            Logger.error('CyclingService', 'getCycling', 'Error while getting cycling. Sending error response.');
            // Send error
            return response.send({success: false});
        }
        Logger.info('CyclingService', 'getCycling', 'Cycling found. Sending response.');
        return response.send({cycling: cycling});
    });
};

exports.getCyclings = function(request, response) {
    Logger.info('CyclingService', 'getCyclings', 'Invocation of getCyclings().');

    cyclingController.getCyclings(request.query, function(err, cyclings) {
        if(err) {
            Logger.error('CyclingService', 'getCyclings', 'Error while getting cyclings. Sending error response.');
            // Send error
            return response.send({success: false});
        }
        Logger.info('CyclingService', 'getCyclings', 'Cyclings found. Sending response.');
        return response.send({cyclings: cyclings});
    });
}
