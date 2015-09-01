var winston = require('winston'),
    fs      = require('fs'),
    util    = require('util');

// Import module to enable logging on LogEntries
var Logentries = require('winston-logentries');

var appConfig = require('./config/app-config');

// Determine logging path
var logDir = process.env.OPENSHIFT_LOG_DIR || __dirname + '/'+appConfig.logging.logDir+'/';

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Determine exectution environment
var env = process.env.NODE_ENV || 'development';

// Suppress Logging messages while executing tests
var suppressLogging = (env === 'test') ? true : false;

var loggerTransports = [
    new winston.transports.Console({
        silent: suppressLogging,
        colorize: true
    }),
    new winston.transports.File({
        silent: suppressLogging,
        maxsize: 4000000, // 4MB
        colorize: true,
        filename: logDir + (appConfig.logging.serverLogFile || 'defaultServerLog.log'),
        json: true
    })
];

var exceptionsTransports = [
    new winston.transports.Console({
        silent: suppressLogging,
        colorize: true
    }),
    new winston.transports.File({
        silent: suppressLogging,
        maxsize: 4000000, // 4MB
        colorize: true,
        filename: logDir + (appConfig.logging.exceptionsLogFile || 'defaultExceptionsLog.log'),
        json: true
    })
];

if(appConfig.logging.token && 'PRODUCTION' === env.toUpperCase()) {
    var transport = new winston.transports.Logentries({token: appConfig.logging.token});
    loggerTransports.push(transport);
    exceptionsTransports.push(transport);
}

/**
 * Logger instance
 * @type {winston}
 */
var logger = new winston.Logger({
    transports: loggerTransports,
    exceptionHandlers: exceptionsTransports
});


/**
 * Returns a message text for logging. Returned text dependes on the
 * given classname, methodname and original message text.
 * Log message is returned in the format: 'classname.methodname: msg'
 */
var getLogText = function(cls, method, msg) {
    var clsMethod = getClassMethodText(cls, method);
    return util.format('%s: %s', clsMethod, msg);
};
/**
 * Concats the classname and the methodname in the format 'class.method'
 * @param  {String} cls Name of the class
 * @param  {String} method Name of the method
 * @return {String} Returns the class.method string
 */
var getClassMethodText = function(cls, method) {
    return util.format('%s.%s', cls, method);
};

var printLevel = -1, indentationString = null, methodStack = [];
var _getIndentation = function(cls, method) {
    var ident = cls+'.'+method;

    if(methodStack[methodStack.length-1] === ident) {
        return indentationString;
    }
    else if(methodStack[methodStack.length-2] === ident){
        methodStack.pop();
        printLevel--;
    }
    else {
        methodStack.push(ident);
        printLevel++;
    }

    var i;
    indentationString = '';
    for(i = 0; i < printLevel; i++) {
        indentationString += '   ';
    }

    return indentationString;
};

var info = function(cls, method, msg, obj) {
    if(!cls) {
        throw new Error('Logging Error: Required cls arguments undefined.');
    }
    if(!method) {
        throw new Error('Logging Error: Required method argument undefined.');
    }

    // Log message. Use default logger
    if(obj) {
        this.info(getLogText(cls, method, msg), obj);
    }
    else {
        this.info(getLogText(cls, method, msg));
    }
};

var error = function(cls, method, msg, err) {
    if(!cls) {
        throw new Error('Logging Error: Required cls arguments undefined.');
    }
    if(!method) {
        throw new Error('Logging Error: Required method argument undefined.');
    }

    // Log message. Use default logger
    if(err) {
        if(err instanceof Error) {
            this.error(getLogText(cls, method, msg), err.toString());
            console.log(err.stack);
        }
        else {
            this.error(getLogText(cls, method, msg), err);
        }
    }
    else {
        this.error(getLogText(cls, method, msg));
    }
};

exports.logger = function() {
    return {
        error: error.bind(logger),
        info:  info.bind(logger)
    };
};