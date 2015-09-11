process.env.NODE_ENV = 'production'

var Server = require('./server'),
    Logger = require('./logging').logger();

Logger.info('App', 'start', 'Starting the SAL application in environment "production".');
// Start the application
Server.start('production');