var Running = require('../models/running').getModel();

var Logger = require('../logging').logger();

// Import Query Data Mixin for filtering and sorting queries
var queryDataMixin = require('../mixins/query-data-mixin');

exports.createRunning = function(runningToAdd, user, callback) {
    Logger.info('RunningController', 'createRunning', 'Invocation of createRunning().');

    if(runningToAdd) {
        Logger.info('RunningController', 'createRunning', 'Adding new cycling.', runningToAdd);
        var running = new Running(runningToAdd);

        running.createdBy = user;
        running.createdAt = new Date();

        running.save(function(err, savedRunning) {
            if(err) {
                Logger.error('RunningController', 'createRunning', 'Error occurred while saving running.', err);
                return callback(err);
            }

            savedRunning.populate('createdBy', function(err, user) {
                if(err) {
                    Logger.error('RunningController', 'createRunning', 'Error while populating running with id' +food.id+'.', err);
                    return callback(err);
                }
                Logger.info('RunningController', 'createRunning', 'Running was created successfully.');
                return callback(null, savedRunning);
            });
        });
    }
};

exports.updateRunning = function(id, updatedRunning, user, callback) {
    Logger.info('RunningController', 'updateRunning', 'Invocation of updateRunning().');

    var query = Running.findOne({id: id});

     // Execute query
    query.exec(function(err, running) {
        if(err) {
            Logger.error('RunningController', 'updateRunning', 'Error while fetching running with id "'+id+'".', err);
            return callback(err);
        }

        if(running) {
            Logger.info('RunningController', 'updateRunning', 'Updating properties of cycling with id "'+id+'".');
            running.date = updatedRunning.date;
            running.name = updatedRunning.name;
            running.description = updatedRunning.description;

            running.startTime = updatedRunning.startTime;
            running.totalTime = updatedRunning.totalTime;

            running.avgHeartRate = updatedRunning.avgHeartRate;
            running.maxHeartRate = updatedRunning.maxHeartRate;
            running.calories = updatedRunning.calories;

            running.timeInHeartRateZone = updatedRunning.timeInHeartRateZone
            running.percentInHeartRateZone = updatedRunning.percentInHeartRateZone;

            running.condition = updatedRunning.condition;
            running.windDirection = updatedRunning.windDirection;
            running.windSpeed = updatedRunning.windSpeed;
            running.windStrength = updatedRunning.windStrength;
            running.windBlasts = updatedRunning.windBlasts;

            Logger.info('RunningController', 'updateRunning', 'Running "'+id+'" was modified by user "'+user.username+'".');
            running.modifiedBy = user;
            running.modifiedAt = new Date();

            running.save(function(err, savedRunning) {
                if(err) {
                    Logger.error('RunningController', 'updateRunning', 'Error while saving running with id "'+id+'".', err);
                    return callback(err)
                }

                savedRunning.populate('createdBy modifiedBy', function(err, running) {
                    if(err) {
                        Logger.error('RunningController', 'updateRunning', 'Error while populating user references for running with id "'+id+'".', err);
                        return callback(err);
                    }

                    Logger.info('RunningController', 'updateRunning', 'Running with id "'+id+'" was updated successfully.');
                    return callback(null, savedRunning);
                });
            });
        }
        else {
            Logger.info('RunningController', 'updateRunning', 'No runnung found for id "'+id+'" . Nothing to update.');
            return callback(null, null);
        }
    });
};

exports.getRunnings = function(queryParams, callback) {
    Logger.info('RunningController', 'getRunnings', 'Invocation of getRunnings().');

    // Prepare query
    var query = Running.find().populate('createdBy modifiedBy');

    // Apply query parameters to the query
    query = queryDataMixin.applyQueryParams(query, queryParams);

    // Execute query
    query.exec(function(err, runnings){
        if(err) {
            Logger.error('RunningController', 'getRunnings', 'Error while querying running list.', err);
            return callback(err);
        }

        Logger.info('RunningController', 'getRunnings', 'Running list was queried successfully.');
        return callback(null, runnings);
    });
};

exports.getRunning = function(id, callback) {
    Logger.info('RunningController', 'getRunning', 'Invocation of getRunning().');

    // Prepate query
    var query = Running.findOne({id: id}).populate('createdBy modifiedBy');

    // Execute query
    query.exec(function(err, running) {
        if(err) {
            Logger.error('RunningController', 'getRunning', 'Error while fetching running with id "'+id+'".', err);
            return callback(err);
        }

        if(running) {
            Logger.info('RunningController', 'getRunning', 'Running with id "'+id+'" was fetched successfully.');
            return callback(null, running);
        }

        Logger.info('RunningController', 'getRunning', 'Running with id "'+id+'" does not exist.');
        return callback();
    });
};