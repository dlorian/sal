var express        = require('express'),
	morgan         = require('morgan'),
	bodyParser     = require('body-parser'),
	//methodOverride = require('method-override'),
	session        = require('express-session'),
	cookieParser   = require('cookie-parser'),
	errorHandler   = require('errorhandler'),
	path           = require('path'),
	passport       = require('passport');

// Import DB manger
var DBManager = require('./db-manager');

var appConfig = require('./config/app-config');

// Import Logger
var Logger = require('./logging').logger();

// Create an express instance
var app = express();
var env = process.env.NODE_ENV || 'development';

var logErrors = function(err, req, res, next) {
	Logger.error('Server', 'logErrors', 'Error occured.');
 	console.error(err.stack);
  	next(err);
};

var clientErrorHandler = function(err, req, res, next) {
	Logger.error('Server', 'clientErrorHandler', 'Error occured.');
	if (req.xhr) {
    	res.status(500).send({ error: 'Something blew up!' });
  	}
  	else {
    	next(err);
  	}
};

var runExpressServer = function() {
	Logger.info('Server', 'runExpressServer', 'Initialize Express server.');
	if(process.env.OPENSHIFT_NODEJS_IP) {
		Logger.info('Server', 'runExpressServer', 'OPENSHIFT_NODEJS_IP = ' + process.env.OPENSHIFT_NODEJS_IP);
	}
	if(process.env.OPENSHIFT_NODEJS_PORT) {
		Logger.info('Server', 'runExpressServer', 'OPENSHIFT_NODEJS_PORT = ' + process.env.OPENSHIFT_NODEJS_PORT);
	}

	var serverPort      = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || appConfig.serverPort;
	var serverIpAddress = process.env.OPENSHIFT_NODEJS_IP   || appConfig.serverIp;

	if(!serverPort || !serverIpAddress) {
		console.log(serverPort);
		console.log(serverIpAddress);
		Logger.error('Server port or ip is undefined. Unable to start application');
		throw new Error('Server port or ip is undefined. Unable to start application');
	}

	Logger.info('Server', 'runExpressServer', 'Express server will use address '+serverIpAddress+':'+serverPort+'.');

	// Set up express application
	app.set('port', serverPort);
	app.set('ipAddress', serverIpAddress);
	//app.use(morgan('dev')); // 'default', 'short', 'tiny', 'dev'
	app.use(bodyParser());
	//app.use(methodOverride());

	// TODO: Make sure that request are using HTTPS
	// https://help.openshift.com/hc/en-us/articles/202398810-How-to-redirect-traffic-to-HTTPS-

	// Required for passport
	// Cookie parser has to be before session. Is required for sessions.
	app.use(cookieParser('A0K!nr6Wo)ZZ4.Xp!ddAOp8&tw!vn4Erpqnvr4982!'));	// Use signed cookies
	app.use(session({
		cookie : {
			//TODO: Use httpOnly
			//secure: true, // Todo: Does not work. Check why!
			//httpOnly: true,
			maxAge: 3600000 * 24 // 1h in ms * 24
		},
		secret: 'A0K!nrZro)ZZ4.Xp!ddAOx84tw!vn4&&rpQNvr4982!'
	}));

	// TODO: Implement the usage of CSRF-Token!!!!!

	app.use(passport.initialize());
	app.use(passport.session());	// Use persistent login sessions

	app.use(express.static(path.join(__dirname, 'public')));

	// Init error handling regarding environment mode
	/*if ('DEVELOPMENT' === env.toUpperCase()) {
		app.use(errorHandler({ dumpExceptions: true, showStack: true }));
	}
	else if('PRODUCTION' === env.toUpperCase()) {
		app.use(errorHandler());
	}*/

	// Load the config for passport
	require('./config/passport')(passport);

	// Simple logger for requests
	app.use(function(req, res, next) {
		Logger.info('Server', 'Request', 'HTTP-Method: '+req.method+' URL: '+req.url);
		next();
	});

	// launch application
	app.listen(serverPort, serverIpAddress, function() {
		Logger.info('Server', 'runExpressServer', 'Express server is listening on host '+serverIpAddress+':'+serverPort+'.');

		// Load the routes
		Logger.info('Server', 'runExpressServer', 'Set up routes for services.');
		require('./routes')(app, passport);

		Logger.info('Server', 'runExpressServer', 'Set up routes for services completed.');
		Logger.info('Server', 'runExpressServer', 'Express server is ready now.');
	});
};

exports.start = function() {
	Logger.info('Server', 'start', 'Starting express server.');

	// If uncaught exception is catched by this error handler, send mail to admin.
	process.on('uncaughtException', function(err) {
		Logger.error('Server', 'onUncaughtException', 'Uncaught Exception occured.', err);
	});

	DBManager.initializeDBConnection(env, function(err, db) {
		// If db connection is established, run server
		runExpressServer();
	});
};