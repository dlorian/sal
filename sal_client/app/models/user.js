import DS from 'ember-data';

export default DS.Model.extend({
    username: DS.attr('string'),
    password: DS.attr('string'),

    firstName: DS.attr('string'),
    lastName: DS.attr('string'),

    fullName: function() {
        return this.get('firstName') + ' ' + this.get('lastName');
    }.property('firstName', 'lastName'),
});