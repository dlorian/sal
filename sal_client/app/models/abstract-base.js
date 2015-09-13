import DS from 'ember-data';

export default DS.Model.extend({

    createdAt: DS.attr('date'),
    createdBy: DS.belongsTo('user', { async: false }),

    modifiedAt: DS.attr('date'),
    modifiedBy: DS.belongsTo('user', {async: false }),

        // General
    date: DS.attr('date', {
        defaultValue: function() {
            return new Date();
        }
    }),

    description: DS.attr('string'),
});