var fs = require('fs');
var parse = require('csv-parse');
var moment = require('moment');

var cyclingController = require('../controllers/cycling-controller');

var env = process.env.NODE_ENV || 'development';

// Import DB manger
var DBManager = require('../db-manager');

var User = require('../models/user').getModel();

var Cycling = require('../models/cycling').getModel();

var isValid = function(str) {
    return (
        str.indexOf('x')     < 0 &&
        str.indexOf('-')     < 0 &&
        str.indexOf('k. A.') < 0 &&
        str.indexOf('kA')    < 0 &&
        str.indexOf('no')    < 0
    );
};

var formatTime = function(timeString) {
    var parts = timeString.split(':');
    parts.forEach(function(part, index) {
        if(part.length === 1) {
            parts[index] = '0'+part;
        }
    });

    return parts.join(':');
};

var getTime = function(time) {
    time = time.replace(/\.|\,/g, ':');
    time = formatTime(time);
    return isValid(time) ? time : null;
};

var toCyclingObject = function(cyclingArray) {
    return {
        date: moment(cyclingArray[0], "D.M.YY").toDate(),
        totalKm: (function() {
            var km = cyclingArray[1].replace(',', '.');
            return isValid(km) ? km : null;
        })(),
        totalTime: getTime(cyclingArray[2]),
        time20: getTime(cyclingArray[3]),
        time30: getTime(cyclingArray[4]),
        avgSpeed: (function() {
            var speed = cyclingArray[5].replace(',', '.');
            return isValid(speed) ? speed : null;
        })(),
        topSpeed: (function() {
            var speed = cyclingArray[6].replace(',', '.');
            return isValid(speed) ? speed : null;
        })(),
        condition: cyclingArray[7].replace(/bew./g, 'bewoelkt'),
        windStrength: (function() {
            var number = parseInt(cyclingArray[8], 10);
            return (isNaN(number) ? null : number);
        })(),
        windSpeed: (function() {
            var number = parseInt(cyclingArray[9], 10);
            return (isNaN(number) ? null : number);
        })(),
        windBlasts: (function() {
            var number = parseInt(cyclingArray[10], 10);
            return (isNaN(number) ? null : number);
        })(),
        windDirection: cyclingArray[11].replace(/\s+/g, ''),
        temperature: (function() {
            var temp = cyclingArray[12].replace(',', '.');
            return isValid(temp) ? temp : null;
        })(),
        description: cyclingArray[13]
    };
};

var getUser = function(callback) {
    var query = User.findOne({username: 'flo'});
    if(query === null) {
        return console.error('Query not defined')
    }

    query.exec(function(err, user) {
        callback(err, user);
    });
};

var createCycling = function(cycling, user) {
    if(user === null) {
        console.error("User is undefined")
    }

    cycling = toCyclingObject(cycling);
    cyclingController.createCycling(cycling, user, function(err, createdCycling) {
        if(err) {
            return console.err(err);
        }
        console.log('Cycling hinzugefügt.')
    });
};

var createCyclings = function(cyclings) {
    getUser(function(err, user) {
        if(err) {
            return console.error(err);
        }

        cyclings.forEach(function(cycling) {
            createCycling(cycling, user);
        });
    });
};

var run = function() {
    fs.readFile('./komplett.csv', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }

        parse(data, {delimiter: ';'}, function(err, output) {
            createCyclings(output);
        });
    });
};

var init = function(callback) {
    DBManager.initializeDBConnection(env, function(err, db) {
        // If db connection is established, run server
        callback();
    });
};

init(run);