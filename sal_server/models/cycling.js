var mongoose = require('mongoose'),
    extend   = require('mongoose-schema-extend'),
    moment   = require('moment');

var AbstractBaseSchema = require('./abstract-base').getSchema();

var timeMatch   = [ /^([0-9]{2}\:)?[0-9]{2}\:[0-9]{2}$/ , "Time does not have the correct format [hh:mm:ss]. ({VALUE})"],
    numberMatch = [ /^[0-9]{1,3}((\.|\,)[0-9]{1,2})?$/  , "Value does not have the correct format. ({VALUE})"];

var dateValidator = function(value) {
    // Verify that the given date of a tour is not in the future
    return !(moment(value).isAfter());
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
    windBlasts:   { type: Number, min: 1},

    // Track
    totalKm:  { type: String, match: numberMatch },
    topSpeed: { type: String, match: numberMatch },
    avgSpeed: { type: String, match: numberMatch },

    // Times
    time20:    { type: String, match: timeMatch },
    time30:    { type: String, match: timeMatch },
    totalTime: { type: String, match: timeMatch }
});

module.exports = {
    getModel:  function() { return mongoose.model('Cycling', cyclingSchema) }
};
