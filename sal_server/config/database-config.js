var util = require('util');

// Import application config
var appConfig = require('./app-config');

// Import Logger
var Logger = require('../logging').logger();

var mongodb = appConfig.mongodb;

var env = process.env.NODE_ENV || 'development';

var dbConnection = null;

if(process.env.OPENSHIFT_MONGODB_DB_URL) {
    Logger.info('Database', 'Initialize', 'Using OPENSHIFT_MONGODB_DB_URL = ' + process.env.OPENSHIFT_MONGODB_DB_URL);
    dbConnection = process.env.OPENSHIFT_MONGODB_DB_URL;
}
else if(env.toLowerCase() == 'production') {
    Logger.info('Database', 'Initialize', 'Using environment "production" for database connection.');
    var name = mongodb.name;
    var host = mongodb.host;
    var port = mongodb.port;
    var username = mongodb.username;
    var password = mongodb.password;
    var authSource = mongodb.authSource;

    //'mongodb://user:pass@host:27017/db?authSource=databaseName'
    dbConnection = util.format('mongodb://%s:%s@%s:%s/%s?authSource=%s', username, password, host, port, name, authSource);
    Logger.info('Database', 'Initialize', 'Using db connection = "'+dbConnection+'".');
}
else {
    Logger.info('Database', 'Initialize', 'Using environment "development" for database connection.');
    dbConnection = util.format('mongodb://%s/%s', mongodb.host, mongodb.name);
    Logger.info('Database', 'Initialize', 'Using db connection =' + dbConnection);
}

/**
 * Database configuration used for the different environments
 */
module.exports = {
    prod: {
        // Collection for production mode
        url: (function(me) {;
            return dbConnection;
        })()
    },
    dev: {
        // Collection for development mode
        url: (function() {
            var db = dbConnection+'-dev';
            return db;
        })()
    },
    test: {
        // Collection for test mode
        url: (function() {
            var db = dbConnection+'-test';
            return db;
        })()
    }
};