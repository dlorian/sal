var Logger = require('../logging').logger();

// Import Query Data Mixin for filtering and sorting queries
var queryDataMixin = require('../mixins/query-data-mixin');

exports.create = function(Model, newModel, user, callback) {
    Logger.info('ModelController', 'create', 'Invocation of create().');
    var model = new Model(newModel);

    model.createdBy = user;
    model.createdAt = new Date();

    model.save(function(err, savedModel) {
        if(err) {
            Logger.error('ModelController', 'create', 'Error occurred while saving model.', err);
            return callback(err);
        }

        savedModel.populate('createdBy', function(err, user) {
            if(err) {
                Logger.error('ModelController', 'create', 'Error while populating model with id' +food.id+'.', err);
                return callback(err);
            }
            Logger.info('ModelController', 'create', 'Model was created successfully.');
            return callback(null, savedModel);
        });
    });
};

exports.update = function(Model, id, updatedModel, user, callback) {
    Logger.info('ModelController', 'update', 'Invocation of update().');
    var query = Model.findOne({id:id});

    // Execute query
    query.exec(function(err, model) {
        if(err) {
            Logger.error('ModelController', 'update', 'Error while fetching model with id "'+id+'".', err);
            return callback(err);
        }

        if(model) {
            Logger.info('ModelController', 'update', 'Updating properties of model with id "'+id+'".');
            for (var property in updatedModel) {
                // TODO Handle associated models
                if(property !== 'createdBy' &&  property !== 'modifiedBy') {
                    model[property] = updatedModel[property];
                }
            }
            Logger.info('ModelController', 'update', 'Model with "'+id+'" was modified by user "'+user.username+'".');
            model.modifiedBy = user;
            model.modifiedAt = new Date();

            Logger.info('ModelController', 'update', 'Saving updated model with id "'+id+'".');
            model.save(function(err, savedModel) {
                if(err) {
                    Logger.error('ModelController', 'update', 'Error while saving model with id "'+id+'".', err);
                    return callback(err)
                }

                savedModel.populate('createdBy modifiedBy', function(err, populatedModel) {
                    if(err) {
                        Logger.error('ModelController', 'update', 'Error while populating user references for model with id "'+id+'".', err);
                        return callback(err);
                    }

                    Logger.info('ModelController', 'update', 'Model with id "'+id+'" was updated successfully.');
                    return callback(null, savedModel);
                });
            });
        }
        else {
            Logger.info('ModelController', 'update', 'No model found for id "'+id+'" . Nothing to update.');
            return callback(null, null);
        }
    });
};

exports.getAll = function(Model, queryParams, callback) {
    Logger.info('ModelController', 'getAll', 'Invocation of getAll().');
    // Prepare query
    var query = Model.find().populate('createdBy modifiedBy');

    // Apply query parameters to the query
    query = queryDataMixin.applyQueryParams(query, queryParams);

    // Execute query
    query.exec(callback);
};

exports.getOne = function(Model, id, callback) {
    Logger.info('ModelController', 'getOne', 'Invocation of getOne().');
    // Prepate query
    var query = Model.findOne({id: id}).populate('createdBy modifiedBy');

    // Execute query
    query.exec(callback);
};