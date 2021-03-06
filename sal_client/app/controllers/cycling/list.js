import Ember from 'ember';

export default Ember.Controller.extend({
    queryParams: ['from', 'to'],

    from: null,
    to: null,

    dateFrom: function() {
        var from = this.get('from');
        if(from && moment(from).isValid()) {
            return moment(from).toDate();
        }
        return null;
    }.property('from'),

    dateTo: function() {
        var to = this.get('to');
        if(to && moment(to).isValid()) {
            return moment(to).toDate();
        }
        return null;
    }.property('to'),

    actions: {
        update: function() {
            this.setProperties({
                from: moment(this.get('dateFrom')).format('YYYY-MM-DD'),
                to: moment(this.get('dateTo')).format('YYYY-MM-DD')
            });
        }
    }
});