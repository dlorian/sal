import Ember from 'ember';

export default Ember.Controller.extend({

    statistic: {
        totalCount: null,
        longestTimes: null,
        overallTotalKm: null,
        bestTotalKms: null,
        bestAvgSpeeds: null,
        bestTopSpeeds: null,
        yearStatistics: null
    },

    init: function() {
        var me = this;

        Ember.$.get('api/statistic').done(function(response) {
           me.set('statistic', response.statistic);
        }).fail(function() {
            console.error('WTF');
        });
    }
});
