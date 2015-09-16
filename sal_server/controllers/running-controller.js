var Running = require('../models/running').getModel();

var Logger = require('../logging').logger();

var modelController = require('../api/model-controller');

exports.createRunning = function(runningToAdd, user, callback) {
    Logger.info('RunningController', 'createRunning', 'Invocation of createRunning().');

    if(runningToAdd) {
        Logger.info('RunningController', 'createRunning', 'Adding new cycling.', runningToAdd);
        modelController.create(Running, runningToAdd, user, function(err, savedRunning) {
            if(err) {
                Logger.error('RunningController', 'createRunning', 'Error occurred while saving running.', err);
                return callback(err);
            }
            Logger.info('RunningController', 'createRunning', 'Running was created successfully.');

            //Logger.info('RunningController', 'createRunning', 'Sending confirmation mail.');
            //sendConfirmationMail(savedRunning);

            return callback(null, savedRunning);
        });
    }
};

exports.updateRunning = function(id, updatedRunning, user, callback) {
    Logger.info('RunningController', 'updateRunning', 'Invocation of updateRunning().');

    if(updatedRunning) {
        modelController.update(Running, id, updatedRunning, user, function(err, savedRunning) {
            if(err) {
                Logger.error('RunningController', 'updateRunning', 'Error occurred while updating running.', err);
                return callback(err);
            }
            Logger.info('RunningController', 'updateRunning', 'Running was updated successfully.');

            //Logger.info('RunningController', 'updateRunning', 'Sending confirmation mail.');
            //sendConfirmationMail(savedCycling);

            return callback(null, savedRunning);
        });
    }
};

var injectDateFilterForField = function(queryParams, field) {
    var dateFilter = { field: field };

    if(queryParams.from) {
        dateFilter.from = queryParams.from;
    }

    if(queryParams.to) {
        dateFilter.to = queryParams.to;
    }

    queryParams.dateFilter = dateFilter;
    delete queryParams.from;
    delete queryParams.to

    // Prepare default sorter for the date filter
    var dateSorter = { field: field, dir: 'asc' };
    if(queryParams.sorters) {
        queryParams.sorters.push(dateSorter);
    }
    else {
        queryParams.sorters = [dateSorter];
    }

    return queryParams;
};

exports.getRunnings = function(queryParams, callback) {
    Logger.info('RunningController', 'getRunnings', 'Invocation of getRunnings().');

    queryParams = injectDateFilterForField(queryParams, 'date');

    modelController.getAll(Running, queryParams, function(err, models) {
        if(err) {
            Logger.error('RunningController', 'getRunnings', 'Error while fetching running list.', err);
            return callback(err);
        }

        Logger.info('RunningController', 'getRunnings', 'Running list was fetched successfully.');
        return callback(null, models);
    });
};

exports.getRunning = function(id, callback) {
    Logger.info('RunningController', 'getRunning', 'Invocation of getRunning().');
    modelController.getOne(Running, id, function(err, running) {
        if(err) {
            Logger.error('RunningController', 'getRunning', 'Error while fetching running with id "'+id+'".', err);
            return callback(err);
        }

        if(running) {
            Logger.info('RunningController', 'getRunning', 'Running with id "'+id+'" was fetched successfully.');
            return callback(null, running);
        }

        Logger.info('RunningController', 'getRunning', 'Running with id "'+id+'" does not exist.');
        return callback(null, null);
    });
};