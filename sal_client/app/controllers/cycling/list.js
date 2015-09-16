import Ember from 'ember';

export default Ember.Controller.extend({
    queryParams: ['from', 'to'],

    from: moment().subtract(1, 'month').format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD'),

    dateFrom: function() {
        return moment(this.get('from')).toDate();
    }.property('from'),

    dateTo: function() {
        return moment(this.get('to')).toDate();
    }.property('to'),

    actions: {
        update: function() {
            this.setProperties({
                from: moment(this.get('dateFrom')).format('YYYY-MM-DD'),
                to: moment(this.get('dateTo')).format('YYYY-MM-DD')
            });
        },

        remove: function() {
            this.setProperties({
                from: null,
                to: null
            });
        }
    }
});