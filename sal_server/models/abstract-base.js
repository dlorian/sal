var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    /**
     * Global ID of the record.
     * @type {ObjectId}
     */
    id: { type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId, unique: true },

    /**
     * Date when the record was created.
     * @type {Date}
     */
    createdAt: Date,
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},

    /**
     * Date when the record was modified for the last time.
     * @type {Date}
     */
    modifiedAt: Date,

    /**
     * Last user who has modified the record.
     * @type {Object}
     */
    modifiedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

schema.pre("save", function(next) {
    next();
});

schema.post('save', function(doc) {

});

module.exports = {
    getSchema: function() { return schema; }
}