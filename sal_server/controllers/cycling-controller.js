var Cycling = require('../models/cycling').getModel();

var mailController = require('../mail/mail-controller');

var modelController = require('../api/model-controller');

var Logger = require('../logging').logger();

var sendConfirmationMail = function(mailData) {
    Logger.info('CyclingController', 'sendConfirmationMail', 'Invocation of sendConfirmationMail().');

    mailController.importTemplate('created-cycling.hbs', function(err, tplFile) {
        if(err) {
            return Logger.error('CyclingController', 'sendConfirmationMail', 'Error occured while importing mail template "created-cycling.hbs".', err);
        }
        var html = mailController.renderHtml(tplFile, mailData);
        mailController.sendHtmlMail('f.dorau@ymail.com', 'Cycling Eintrag hinzugefügt', html);
    });
};

exports.createCycling = function(cyclingToAdd, user, callback) {
    Logger.info('CyclingController', 'createCycling', 'Invocation of createCycling().');

    if(cyclingToAdd) {
        Logger.info('CyclingController', 'createCycling', 'Adding new cycling.', cyclingToAdd);
        modelController.create(Cycling, cyclingToAdd, user, function(err, savedCycling) {
            if(err) {
                Logger.error('CyclingController', 'createCycling', 'Error occurred while saving cycling.', err);
                return callback(err);
            }
            Logger.info('CyclingController', 'createCycling', 'Cycling was created successfully.');

            Logger.info('CyclingController', 'createCycling', 'Sending confirmation mail.');
            sendConfirmationMail(savedCycling);

            return callback(null, savedCycling);
        });
    }
};

exports.updateCycling = function(id, updatedCycling, user, callback) {
    Logger.info('CyclingController', 'updateCycling', 'Invocation of updateCycling().');

    if(updatedCycling) {
        modelController.update(Cycling, id, updatedCycling, user, function(err, savedCycling) {
            if(err) {
                Logger.error('CyclingController', 'updateCycling', 'Error occurred while updating cycling.', err);
                return callback(err);
            }
            Logger.info('CyclingController', 'updateCycling', 'Cycling was updated successfully.');

            //Logger.info('CyclingController', 'updateCycling', 'Sending confirmation mail.');
            //sendConfirmationMail(savedCycling);

            return callback(null, savedCycling);
        });
    }
};

exports.getCyclings = function(queryParams, callback) {
    Logger.info('CyclingController', 'getCyclings', 'Invocation of getCyclings().');
    modelController.getAll(Cycling, queryParams, function(err, models) {
        if(err) {
            Logger.error('CyclingController', 'getCyclings', 'Error while fetching cycling list.', err);
            return callback(err);
        }

        Logger.info('CyclingController', 'getCyclings', 'Cycling list was fetched successfully.');
        return callback(null, models);
    });
};

exports.getCycling = function(id, callback) {
    Logger.info('CyclingController', 'getCycling', 'Invocation of getCycling().');
    modelController.getOne(Cycling, id, function(err, cycling) {
        if(err) {
            Logger.error('CyclingController', 'getCycling', 'Error while fetching cycling with id "'+id+'".', err);
            return callback(err);
        }

        if(cycling) {
            Logger.info('CyclingController', 'getCycling', 'Cycling with id "'+id+'" was fetched successfully.');
            return callback(null, cycling);
        }

        Logger.info('CyclingController', 'getCycling', 'Cycling with id "'+id+'" does not exist.');
        return callback(null, null);
    });
};