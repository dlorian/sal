import DS from 'ember-data';

export default DS.Model.extend({

    createdAt: DS.attr('date'),
    createdBy: DS.belongsTo('user'),

    modifiedAt: DS.attr('date'),
    modifiedBy: DS.belongsTo('user')
});