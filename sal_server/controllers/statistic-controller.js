var extend = require('util')._extend;

var Cycling = require('../models/cycling').getModel();

var timeMixin = require('../mixins/time-mixin');

// Import Logger
var Logger = require('../logging').logger();

var _fireQuery = function(query, callback) {
    Logger.info('StatisticController', '_fireQuery', 'Invocation of _fireQuery().');
    query.exec(function(err, data) {
        if(err) {
            Logger.error('StatisticController', '_fireQuery', 'Error while firing query.');
            return callback(err);
        }
        return callback(null, data);
    });
};

var _findBestTotalKms = function(callback) {
    Logger.info('StatisticController', '_findBestTotalKms', 'Invocation of _findBestTotalKms().');
    var query = Cycling.find().limit(3).sort('-totalKm').select('id totalKm date');
    _fireQuery(query, callback);
};

var _findBestAvgSpeeds = function(callback) {
    Logger.info('StatisticController', '_findBestAvgSpeeds', 'Invocation of _findBestAvgSpeeds().');
    var query = Cycling.find().limit(3).sort('-avgSpeed').select('id avgSpeed date');
    _fireQuery(query, callback);
};

var _findBestTopSpeeds = function(callback) {
    Logger.info('StatisticController', '_findBestTopSpeeds', 'Invocation of _findBestTopSpeeds().');
    var query = Cycling.find().limit(3).sort('-topSpeed').select('id topSpeed date');
    _fireQuery(query, callback);
};

var _findBestTime20 = function(callback) {
    Logger.info('StatisticController', '_findBestTime20', 'Invocation of _findBestTime20().');
    var query = Cycling.find().limit(3).sort({'time20': 1}).select('id time20 date').where('time20').ne(null);
    _fireQuery(query, callback);
};

var _findBestTime30 = function(callback) {
    Logger.info('StatisticController', '_findBestTime30', 'Invocation of _findBestTime30().');
    var query = Cycling.find().limit(3).sort({'time30': 1}).select('id time30 date').where('time30').ne(null);
    _fireQuery(query, callback);
};

var _findLongestTimes = function(callback) {
    Logger.info('StatisticController', '_findLongestTimes', 'Invocation of _findLongestTimes().');
    var query = Cycling.find().limit(3).sort('-totalTime -totalKm').select('id totalTime totalKm date');
    _fireQuery(query, callback);
};

var _overallStatistics = function(callback) {
    Cycling.aggregate(
        [
            {
                $group: {
                    _id: null,
                    overallTotalKm: { $sum: "$totalKm" },
                    overallAvgAvgSpeed: { $avg: "$avgSpeed" },
                    overallAvgTopSpeed: { $avg: "$topSpeed" },
                    overallAvgTotalKm: { $avg: "$totalKm" },
                    count: {$sum: 1}
                }
            }
        ],
        function (err, data) {
            if(err) {
                Logger.error('StatisticController', '_overallStatistics', 'Error while aggregating total kilometers.');
                return callback(err);
            }

            return callback(null, data[0]);
        }
    );
};

var _yearStatistics = function(callback) {
    Cycling.aggregate(
        [
            {
                $group: {
                    _id: { year: { $year: "$date" } },
                    totalKmOfYear: { $sum: "$totalKm" },
                    avgTotalKmOfYear: { $avg: "$totalKm" },
                    avgAvgSpeedOfYear: {$avg: "$avgSpeed"},
                    avgTopSpeedOfYear: {$avg: "$topSpeed"},
                    count: {$sum: 1}
                }
            }
        ],
        function (err, data) {
            if(err) {
                Logger.error('StatisticController', '_yearStatistics', 'Error while aggregating year statistics.');
                return callback(err);
            }
            return callback(null, data);
        }
    );
};

var _avgSpeedForKm = function(km, time) {
    var m = km * 1000;
    // Convert time string into seconds
    var timeNumber = timeMixin.toTimeNumber(time);

    return (m / timeNumber) * 3.6;
};

exports.getStatistics = function(callback) {
    Logger.info('StatisticController', 'getStatistics', 'Invocation of getStatistics().');
    var cbCounter = 0;

    var statistic = {
        longestTimes: null,
        bestTotalKms: null,
        bestAvgSpeeds: null,
        bestTopSpeeds: null,
        bestTime20: null,
        bestTime30: null,
        overallStatistics: null,
        yearStatistics: null
    };

    var invokeCallback = function(err) {
        if(err) {
            Logger.error('StatisticController', 'invokeCallback', 'Error while finding statistics occured.', err);
        }
        cbCounter++;
        if(cbCounter === 8) {
            callback(null, statistic);
        }
    };

    _overallStatistics(function(err, data) {
        if(err) {
            Logger.error('StatisticController', '_overallStatistics', 'Error while aggregating cyclings.');
            return invokeCallback(err);
        }

        // Remove group id of result
        delete data._id;

        statistic.overallStatistics = data;
        invokeCallback();
    });

    _findLongestTimes(function(err, data) {
        if(err) {
            Logger.error('StatisticController', '_countCyclings', 'Error while counting cyclings.');
            return invokeCallback(err);
        }
        statistic.longestTimes = data;
        invokeCallback();
    });

    _findBestTopSpeeds(function(err, data) {
        if(err) {
            Logger.error('StatisticController', '_findBestAvgSpeeds', 'Error while finding best top speeds.');
            return invokeCallback(err);
        }
        statistic.bestTopSpeeds = data;
        invokeCallback();
    });

    _findBestAvgSpeeds(function(err, data) {
        if(err) {
            Logger.error('StatisticController', '_findBestAvgSpeeds', 'Error while finding best average speeds.');
            return invokeCallback(err);
        }
        statistic.bestAvgSpeeds = data;
        invokeCallback();
    });

    _findBestTotalKms(function(err, data) {
        if(err) {
            Logger.error('StatisticController', '_findBestAvgSpeeds', 'Error while finding best total kilometers.');
            return invokeCallback(err);
        }
        statistic.bestTotalKms = data;
        invokeCallback();
    });

    _findBestTime20(function(err, data) {
        if(err) {
            Logger.error('StatisticController', '_findBestTime20', 'Error while finding best time for 20 kilometers.');
            return invokeCallback(err);
        }

        statistic.bestTime20 = [];

        data.forEach(function(item) {
            var element = extend(item.toObject(), {avgSpeed20: _avgSpeedForKm(20, item.time20)});
            statistic.bestTime20.push(element);
        });

        invokeCallback();
    });

    _findBestTime30(function(err, data) {
        if(err) {
            Logger.error('StatisticController', '_findBestTime30', 'Error while finding best times for 30 kilometers.');
            return invokeCallback(err);
        }

        statistic.bestTime30 = [];

        data.forEach(function(item) {
            var element = extend(item.toObject(), {avgSpeed30: _avgSpeedForKm(30, item.time30)});
            statistic.bestTime30.push(element);
        });

        invokeCallback();
    });

    _yearStatistics(function(err, data) {
        if(err) {
            Logger.error('StatisticController', '_overallTotalKm', 'Error while aggregating cyclings.');
            return invokeCallback(err);
        }

        // Remove group id of result
        data.forEach(function(item, index, arr) {
            item.year = item._id.year;
            delete item._id;
        });

        statistic.yearStatistics = data;
        invokeCallback();
    });
};