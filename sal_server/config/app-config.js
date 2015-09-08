var env = process.env.NODE_ENV || 'development';

// Load the config
var config = null;
try {
    config = require('../config.json');
}
catch(e) {
    throw new Error("Config file is missing. Unable to start application");
}

var server = null, mongodb = null;
if(env.toLowerCase() == 'production') {
    server = config.production.server;
    mongodb = config.production.mongodb;
}
else {
    server = config.development.server;
    mongodb = config.development.mongodb;
}

if(config) {
    module.exports = {
        applicationName: config.applicationName,
        server: {
            port: server.port,
            ip: server.ip
        },
        mongodb: {
            name: mongodb.name,
            host: mongodb.host,
            port: mongodb.port,
            username: mongodb.username,
            password: mongodb.password,
            authSource: mongodb.authSource
        },
        logging: {
            logDir: config.logging.logDir,
            serverLogFile: config.logging.serverLogFile,
            exceptionsLogFile: config.logging.exceptionsLogFile,
            token: config.logging.token
        }
    };
}