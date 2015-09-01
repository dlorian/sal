var applicationName = 'sal';

var server = {
    ip: '127.0.0.1',
    port: 8080
};

var logging = {
    logDir: 'log',
    serverLogFile: 'server.log',
    exceptionsLogFile: 'exceptions.log',
    token: '8fb67f8e-28e8-4388-8c1b-77a3b2f84a1b'
};

module.exports = {
    applicationName: applicationName,
    serverPort: server.port,
    serverIp: server.ip,
    logging: {
        logDir: logging.logDir,
        serverLogFile: logging.serverLogFile,
        exceptionsLogFile: logging.exceptionsLogFile,
        token: logging.token
    }
};