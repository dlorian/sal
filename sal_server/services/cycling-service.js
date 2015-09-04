var cyclingController = require('../controllers/cycling-controller');

var Logger = require('../logging').logger();

exports.addCycling = function(request, response) {
    Logger.info('CyclingService', 'addCycling', 'Invocation of addCycling().');

    var newCycling = request.body.cycling;

    cyclingController.createCycling(newCycling, function(err, cycling){
        if(err) {
            Logger.error('CyclingService', 'addCycling', 'Error while adding cycling. Sending error response.');
            // Send error
            return response.send({success: false});
        }
        Logger.info('CyclingService', 'addCycling', 'Cycling added. Sending response.');
        return response.send({success:true, cycling: cycling});
    });
};

exports.getCycling = function(request, response) {
    Logger.info('CyclingService', 'getCycling', 'Invocation of getFood().');
    var id = request.params.id;

    cyclingController.getCycling(id, function(err, cycling) {
        if(err) {
            Logger.error('CyclingService', 'getCycling', 'Error while getting cycling. Sending error response.');
            // Send error
            return response.send({success: false});
        }
        Logger.info('CyclingService', 'getCycling', 'Cycling found. Sending response.');
        return response.send({success:true, cycling: cycling});
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
        return response.send({sucess:true, cyclings: cyclings});
    });
}
