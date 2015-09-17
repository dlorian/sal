// Import running controller
var statisticController = require('../controllers/statistic-controller');

// Import login controller
var loginController = require('../controllers/login-controller');

// Import Logger
var Logger = require('../logging').logger();

exports.getStatistics = function(request, response) {
    Logger.info('StatisticService', 'getStatistics', 'Invocation of getStatistics().');

    statisticController.getStatistics(function(err, statistic){
        if(err) {
            Logger.error('StatisticService', 'getStatistics', 'Error while fetching statistic. Sending error response.');
            // Send error
            return response.send({success: false});
        }
        Logger.info('StatisticService', 'getStatistics', 'Statistic fetched. Sending response.');
        return response.send({statistic: statistic});
    });
};