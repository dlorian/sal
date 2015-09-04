var Cycling = require('../models/cycling').getModel();

var Logger = require('../logging').logger();

exports.createCycling = function(cyclingToAdd, callback) {
    Logger.info('CyclingController', 'add', 'Invocation of createCycling().');

    if(cyclingToAdd) {
        Logger.info('CyclingController', 'createCycling', 'Adding new cycling.', cyclingToAdd);
        var cycling = new Cycling(cyclingToAdd);

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

exports.getCyclings = function(queryParams, callback) {
    Logger.info('CyclingController', 'getCyclings', 'Invocation of getCyclings().');

    // Prepare query
    var query = Cycling.find().populate('createdBy modifiedBy');

    // Apply query parameters to the query
    //query = queryDataMixin.applyQueryParams(query, queryParams);

    // Execute query
    query.exec(function(err, cyclings){
        if(err) {
            Logger.error('CyclingController', 'getCyclings', 'Error while querying cycling list.', err);
            return callback(err);
        }

        Logger.info('CyclingController', 'getCyclings', 'Cycling list was queried successfully.');
        return callback(null, cyclings);
    });
}

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
}