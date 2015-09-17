var Cycling = require('../models/cycling').getModel();

// Import Logger
var Logger = require('../logging').logger();

var _findBestTotalKms = function(callback) {
    Logger.info('StatisticController', '_findBestTotalKms', 'Invocation of _findBestTotalKms().');
    var query = Cycling.find().limit(3).sort('-totalKm').select('id totalKm date');

    query.exec(function(err, data) {
        if(err) {
            Logger.error('StatisticController', '_findBestTotalKms', 'Error while finding best total kilometers.');
            return callback(err);
        }
        return callback(null, data);
    });
};

var _findBestAvgSpeeds = function(callback) {
    Logger.info('StatisticController', '_findBestAvgSpeeds', 'Invocation of _findBestAvgSpeeds().');
    var query = Cycling.find().limit(3).sort('-avgSpeed').select('id avgSpeed date');

    query.exec(function(err, data) {
        if(err) {
            Logger.error('StatisticController', '_findBestAvgSpeeds', 'Error while finding best average speeds.');
            return callback(err);
        }
        return callback(null, data);
    });
};

var _findBestTopSpeeds = function(callback) {
    Logger.info('StatisticController', '_findBestTopSpeeds', 'Invocation of _findBestTopSpeeds().');
    var query = Cycling.find().limit(3).sort('-topSpeed').select('id topSpeed date');

    query.exec(function(err, data) {
        if(err) {
            Logger.error('StatisticController', '_findBestTopSpeeds', 'Error while findung best top speeds.');
            return callback(err);
        }
        return callback(null, data);
    });
};

exports.getStatistics = function(callback) {
    Logger.info('StatisticController', 'getStatistics', 'Invocation of getStatistics().');
    var cbCounter = 0;

    var statistic = {
        totalKms: null,
        avgSpeeds: null,
        topSpeeds: null
    };

    var invokeCallback = function(err) {
        if(err) {
            Logger.error('StatisticController', 'invokeCallback', 'Error while finding statistics occured.');
        }
        cbCounter++;
        if(cbCounter === 3) {
            callback(null, statistic);
        }
    };

    _findBestTopSpeeds(function(err, data) {
        if(err) {
            return invokeCallback(err);
        }
        statistic.topSpeeds = data;
        invokeCallback();
    });

    _findBestAvgSpeeds(function(err, data) {
        if(err) {
            return invokeCallback(err);
        }
        statistic.avgSpeeds = data;
        invokeCallback();
    });

    _findBestTotalKms(function(err, data) {
        if(err) {
            return invokeCallback(err);
        }
        statistic.totalKms = data;
        invokeCallback();
    });
};