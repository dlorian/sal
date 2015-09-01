var Server = require('./server'),
    Logger = require('./logging').logger();

// Start the application
Logger.info('App', 'start', 'Starting the SAL application');
Server.start();