var mongoose   = require('mongoose'),
    jsonSelect = require('mongoose-json-select');
    passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({

    id: { type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId, unique: true },

    username: { type: String, required: true, index: { unique: true } },

    password:  { type: String, required: true },

    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },

    lastLogin: { type: Date }
});

var options = {
    lastLoginField: 'lastLogin'
};

userSchema.plugin(passportLocalMongoose, options);

// Force mongoose to serialize only the specified fields
userSchema.plugin(jsonSelect, 'id username firstName lastName lastLogin');

module.exports = {
    getSchema: function() { return userSchema },
    getModel:  function() { return mongoose.model('User', userSchema) }
};