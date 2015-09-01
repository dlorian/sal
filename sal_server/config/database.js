var Logger = require('../logging').logger();

var appConfig = require('./app-config');

// URL of used database
var dbConnection = 'mongodb://localhost/';

if(process.env.OPENSHIFT_MONGODB_DB_URL) {
    Logger.info('Server', 'getDbConnection', 'OPENSHIFT_MONGODB_DB_URL = ' + process.env.OPENSHIFT_MONGODB_DB_URL);
    dbConnection = process.env.OPENSHIFT_MONGODB_DB_URL;
}

/**
 * Database configuration used for the different environments
 */
module.exports = {
    prod: {
        // Collection for production mode
        url: (function(me) {
            var db = dbConnection + appConfig.applicationName;
            return db;
        })()
    },
    dev: {
        // Collection for development mode
        url: (function() {
            var db = dbConnection +  appConfig.applicationName+'-dev';
            return db;
        })()
    },
    test: {
        // Collection for test mode
        url: (function() {
            var db = dbConnection +  appConfig.applicationName+'-test';
            return db;
        })()
    }
};