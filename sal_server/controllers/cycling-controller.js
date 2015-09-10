var Cycling = require('../models/cycling').getModel();

var Logger = require('../logging').logger();

// Import Query Data Mixin for filtering and sorting queries
var queryDataMixin = require('../mixins/query-data-mixin');

exports.createCycling = function(cyclingToAdd, user, callback) {
    Logger.info('CyclingController', 'createCycling', 'Invocation of createCycling().');

    if(cyclingToAdd) {
        Logger.info('CyclingController', 'createCycling', 'Adding new cycling.', cyclingToAdd);
        var cycling = new Cycling(cyclingToAdd);

        cycling.createdBy = user;
        cycling.createdAt = new Date();

        cycling.save(function(err, savedCycling) {
            if(err) {
                Logger.error('CyclingController', 'createCycling', 'Error occurred while saving cycling.', err);
                return callback(err);
            }

            savedCycling.populate('createdBy', function(err, user) {
                if(err) {
                    Logger.error('CyclingController', 'createCycling', 'Error while populating cycling with id' +food.id+'.', err);
                    return callback(err);
                }
                Logger.info('CyclingController', 'createCycling', 'Cycling was created successfully.');
                return callback(null, savedCycling);
            });
        });
    }
};

exports.updateCycling = function(id, updatedCycling, user, callback) {
    Logger.info('CyclingController', 'updateCycling', 'Invocation of updateCycling().');

    var query = Cycling.findOne({id:id});

    // Execute query
    query.exec(function(err, cycling) {
        if(err) {
            Logger.error('CyclingController', 'updateCycling', 'Error while fetching cycling with id "'+id+'".', err);
            return callback(err);
        }

        if(cycling) {
            Logger.info('CyclingController', 'updateCycling', 'Updating properties of cycling with id "'+id+'".');
            cycling.date = updatedCycling.date;
            cycling.name = updatedCycling.name;
            cycling.description = updatedCycling.description;

            cycling.totalTime = updatedCycling.totalTime;
            cycling.time20 = updatedCycling.time20;
            cycling.time30 = updatedCycling.time30;

            cycling.totalKm = updatedCycling.totalKm;
            cycling.avgSpeed = updatedCycling.avgSpeed;
            cycling.topSpeed = updatedCycling.topSpeed;

            cycling.condition = updatedCycling.condition;
            cycling.temperature = updatedCycling.temperature;
            cycling.windDirection = updatedCycling.windDirection;
            cycling.windSpeed = updatedCycling.windSpeed;
            cycling.windStrength = updatedCycling.windStrength;
            cycling.windBlasts = updatedCycling.windBlasts;

            Logger.info('CyclingController', 'updateCycling', 'Cycling "'+id+'" was modified by user "'+user.username+'".');
            cycling.modifiedBy = user;
            cycling.modifiedAt = new Date();

            cycling.save(function(err, savedCycling) {
                if(err) {
                    Logger.error('CyclingController', 'updateCycling', 'Error while saving running with id "'+id+'".', err);
                    return callback(err)
                }

                savedCycling.populate('createdBy modifiedBy', function(err, cycling) {
                    if(err) {
                        Logger.error('CyclingController', 'updateCycling', 'Error while populating user references for running with id "'+id+'".', err);
                        return callback(err);
                    }

                    Logger.info('CyclingController', 'updateCycling', 'Running with id "'+id+'" was updated successfully.');
                    return callback(null, savedCycling);
                });
            });
        }
        else {
            Logger.info('CyclingController', 'updateCycling', 'No cycling found for id "'+id+'" . Nothing to update.');
            return callback(null, null);
        }
    });
};

exports.getCyclings = function(queryParams, callback) {
    Logger.info('CyclingController', 'getCyclings', 'Invocation of getCyclings().');

    // Prepare query
    var query = Cycling.find().populate('createdBy modifiedBy');

    // Apply query parameters to the query
    query = queryDataMixin.applyQueryParams(query, queryParams);

    // Execute query
    query.exec(function(err, cyclings){
        if(err) {
            Logger.error('CyclingController', 'getCyclings', 'Error while querying cycling list.', err);
            return callback(err);
        }

        Logger.info('CyclingController', 'getCyclings', 'Cycling list was queried successfully.');
        return callback(null, cyclings);
    });
};

exports.getCycling = function(id, callback) {
    Logger.info('CyclingController', 'getCycling', 'Invocation of getCycling().');

    // Prepate query
    var query = Cycling.findOne({id: id}).populate('createdBy modifiedBy');

    // Execute query
    query.exec(function(err, cycling) {
        if(err) {
            Logger.error('CyclingController', 'getCycling', 'Error while fetching cycling with id "'+id+'".', err);
            return callback(err);
        }

        if(cycling) {
            Logger.info('CyclingController', 'getCycling', 'Cycling with id "'+id+'" was fetched successfully.');
            return callback(null, cycling);
        }

        Logger.info('CyclingController', 'getCycling', 'Cycling with id "'+id+'" does not exist.');
        return callback();
    });
};