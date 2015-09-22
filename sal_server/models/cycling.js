var mongoose = require('mongoose'),
    extend   = require('mongoose-schema-extend'),
    moment   = require('moment');

require('mongoose-big-decimal')(mongoose);

var ValidationError = mongoose.Error.ValidationError;
var ValidatorError  = mongoose.Error.ValidatorError;

var AbstractBaseSchema = require('./abstract-base').getSchema();

var timeMatch   = [ /^([0-9]{1,2}\:)?[0-9]{2}\:[0-9]{2}$/ , "Time does not have the correct format [hh:mm:ss]. ({PATH} : {VALUE})"],
    numberMatch = [ /^[0-9]{1,3}((\.|\,)[0-9]{1,2})?$/  , "Value does not have the correct format. ({PATH} : {VALUE})"];

var dateValidator = function(value) {
    // Verify that the given date of a tour is not in the future
    return !(moment(value).isAfter());
};

var toTimeNumber = function(timeString) {
    var time = timeString.split(':');
    time.forEach(function(item, index) {
        time[index] = parseInt(item);
    });

    var timeNumber = null;
    if(time.length > 2) {
        timeNumber = (time[0] * 3600) + (time[1] * 60) + time[2];
    }
    else {
        timeNumber = (time[0] * 60) + time[1];
    }

    return timeNumber;
};

var fromTimeNumber = function(timeNumber) {
    var time = [];
    // Hours
    time[0] = '' + Math.floor(timeNumber / 3600);

    var leaves = timeNumber - time[0] * 3600;
    // Minutes
    time[1] = '' + Math.floor(leaves / 60);

    // Seconds
    time[2] = '' + (leaves - 60 * time[1]);

    for(var i = 0; i < time.length; i++) {
        if(time[i].length === 1) {
            time[i] = '0' + time[i];
        }
    }
    return time.join(':');
};

var setTime = function(timeString) {
    if(!timeString) {
        return timeString;
    }

    var test = timeMatch[0].test(timeString);
    if(!test) {
        var error = new ValidationError(this);
        error.errors.email = new ValidatorError('email', timeMatch[1], 'notvalid', this.email);
    }
    // Validate string
    return toTimeNumber(timeString);
};

var getTime = function(timeNumber) {
    if(!timeNumber) {
        return timeNumber
    }
    return fromTimeNumber(timeNumber);
};

var getNumber = function(number) {
    console.log(number);
    return number;
};

// Create a Schema for the model
var cyclingSchema = AbstractBaseSchema.extend({

    description: String,

    date: { type: Date, required: true, validate: dateValidator },

    // Weather
    condition:     String,
    windDirection: String,
    temperature:  { type: String, match: numberMatch },
    windSpeed:    { type: Number, min: 1},
    windStrength: { type: Number, min: 1},
    windBlasts:   { type: Number, min: 0},

    // Track
    // BigDecimal is not able to aggregate, because they are persisted as strings.
    totalKm:  { type: Number },
    topSpeed: { type: Number },
    avgSpeed: { type: Number },

    // Times
    time20:    { type: Number, get: getTime, set: setTime },
    time30:    { type: Number, get: getTime, set: setTime },
    totalTime: { type: Number, get: getTime, set: setTime }
});

cyclingSchema.set('toObject', { getters: true });
cyclingSchema.set('toJSON', { getters: true });

module.exports = {
    getModel:  function() { return mongoose.model('Cycling', cyclingSchema) }
};
