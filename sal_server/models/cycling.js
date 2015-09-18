var mongoose = require('mongoose'),
    extend   = require('mongoose-schema-extend'),
    moment   = require('moment');

require('mongoose-big-decimal')(mongoose);

var AbstractBaseSchema = require('./abstract-base').getSchema();

var timeMatch   = [ /^([0-9]{1,2}\:)?[0-9]{2}\:[0-9]{2}$/ , "Time does not have the correct format [hh:mm:ss]. ({PATH} : {VALUE})"],
    numberMatch = [ /^[0-9]{1,3}((\.|\,)[0-9]{1,2})?$/  , "Value does not have the correct format. ({PATH} : {VALUE})"];

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
    windBlasts:   { type: Number, min: 0},

    // Track
    totalKm:  { type: mongoose.Schema.Types.BigDecimal },
    topSpeed: { type: mongoose.Schema.Types.BigDecimal },
    avgSpeed: { type: mongoose.Schema.Types.BigDecimal },

    // Times
    time20:    { type: String, match: timeMatch },
    time30:    { type: String, match: timeMatch },
    totalTime: { type: String, match: timeMatch }
});

module.exports = {
    getModel:  function() { return mongoose.model('Cycling', cyclingSchema) }
};
