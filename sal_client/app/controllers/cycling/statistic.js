import Ember from 'ember';

export default Ember.Controller.extend({
    statistic: {
        topSpeeds: null,
        avgSpeeds: null,
        totalKms: null
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
