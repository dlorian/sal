var mongoose = require('mongoose');

// Import required database configuration
var configDB = require('./config/database');

// Import Logger
var Logger = require('./logging').logger();

/**
 * Singleton
 * Stores the connection to the database if exists.
 * {Test: connection}
 * @type {Object}
 */
this.dbConnections = {};

// Save this reference to access db connections object
var me = this;

var _getConnectionUrl = function(env) {
    Logger.info('DBManager', '_getConnectionUrl', 'Invocation of _getConnectionUrl().');
    var connectionUrl;
    if('PRODUCTION' === env.toUpperCase() || 'PROD' === env.toUpperCase()) {
        Logger.info('DBManager', '_getConnectionUrl', 'Execution environment of server app: "Production".');
        connectionUrl = configDB.prod.url;
    }
    else if('TEST' === env.toUpperCase()) {
        Logger.info('DBManager', '_getConnectionUrl', 'Execution environment of server app: "Test".');
        connectionUrl = configDB.test.url;
    }
    else if('DEVELOPMENT' === env.toUpperCase() || 'DEV' === env.toUpperCase()){
        Logger.info('DBManager', '_getConnectionUrl', 'Execution environment of server app: "Development".');
        connectionUrl = configDB.dev.url;
    }
    else {
        Logger.error('DBManager', '_getConnectionUrl', 'Invalid environment "'+env+'".');
        throw new Error('Invalid environment "'+env+'". Could not establish database connection.');
    }
    return connectionUrl;
};

var _connect = function(env, callback) {
    Logger.info('DBManager', '_connect', 'Invocation of _connect().');

    if(!env) {
        throw new Error('Environment is not defined.');
    }

    // Initialize database connection
    Logger.info('DBManager', '_connect', 'Initialize database connection for "'+env+'".');
    var connectionUrl = _getConnectionUrl(env);

    if(me.dbConnections[env.toUpperCase()]) {
        Logger.info('DBManager', '_connect', 'Connection to "'+env+'" database already established.');
        return callback(null, me.dbConnections[env.toUpperCase()]);
    }

    Logger.info('DBManager', '_connect', 'Use database connection "'+connectionUrl+'".');
    mongoose.connect(connectionUrl);

    // Save the database connection
    me.dbConnections[env.toUpperCase()] = mongoose.connection;

    var db =  me.dbConnections[env.toUpperCase()];

    db.on('error', function(err) {
        Logger.error('DBManager', '_connect', 'Database connection error occrured', err);
    });

    db.once('open', function() {
        // If DB connection is established, run express server.
        Logger.info('DBManager', '_connect', 'Database connection established.');
        if(callback) {
            callback(null, me.dbConnections[env.toUpperCase()]);
        }
    });
};

var _connectionIsOpen = function(env) {
    return !!me.dbConnections[env.toUpperCase()];
};

var _getDbConnection = function(env, callback) {
    if(_connectionIsOpen(env)) {
        return callback(null, me.dbConnections[env.toUpperCase()]);
    }
    else {
        throw new Error('No database connection established for "'+env+'".');
    }
};

exports.initializeDBConnection = function(env, callback) {
    Logger.info('DBManager', 'initializeDBConnection', 'Invocation of initializeDBConnection().');

    try {
        if(_connectionIsOpen(env)) {
            return _getDbConnection(env, callback);
        }

        Logger.info('DBManager', 'initializeDBConnection', 'Initialization of DB connection for environment "'+env+'".');
        _connect(env, callback);
    }
    catch(err) {
        Logger.error('DBManager', 'initializeDBConnection', 'Error occured while connecting to database.', err);
        return callback(err);
    }
};

/**
 * Returns an exisitng database connection for the given environemnt. Otherwise null.
 * @param  {[type]}   env      Environment used for the connection (e.g. 'test', 'production' or 'developnent')
 * @param  {Function} callback
 */
exports.getDBConnection = function(env, callback) {
    Logger.info('DBManager', 'getDBConnection', 'Invocation of getDBConnection().');
    try {
        _getDbConnection(env, callback);
    }
    catch(err) {
        Logger.error('DBManager', '_connect', 'Error occured while getting database connection for "'+env+'".', err);
        return callback(err);
    }

}