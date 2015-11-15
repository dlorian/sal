import Ember from 'ember';

export default Ember.Component.extend({
    attributeBindings:['data, isDisabled'],

    $conditionSelectPicker: null,
    $windDirectionSelectPicker: null,

    weatherConditions: [
        {
            value: 'SUNNY',
            icon: "<i class='wi wi-day-sunny'><span class='option-text'>Sonnig</span></i>"
        },
        {
            value: 'CLOUDY',
            icon: "<i class='wi wi-day-cloudy'><span class='option-text'>Leicht bewölkt</span></i>"
        },
        {
            value: 'RAIN_MIX',
            icon: "<i class='wi wi-rain-mix'><span class='option-text'>Leicht bewölkt / Regen</span></i>"
        },
        {
            value: 'CLOUD',
            icon: "<i class='wi wi-cloud'><span class='option-text'>Bewölkt</span></i>"
        },
        {
            value: 'SHOWERS',
            icon: "<i class='wi wi-showers'><span class='option-text'>Bewölkt / Regen</span></i>"
        },
        {
            value: 'RAIN',
            icon: "<i class='wi wi-rain'><span class='option-text'>Regen</span></i>"
        }
    ],

    windDirections: [
        {
            value: 'NORTH',
            icon: "<i class='wi wi-wind from-0-deg'></i><span class='option-text'>Nord</span>"
        },
        {
            value: 'NORTH_EAST',
            icon: "<i class='wi wi-wind from-45-deg'></i><span class='option-text'>Nord-Ost</span>"
        },
                {
            value: 'EAST',
            icon: "<i class='wi wi-wind from-90-deg'></i><span class='option-text'>Ost</span>"
        },
                {
            value: 'SOUTH_EAST',
            icon: "<i class='wi wi-wind from-135-deg'></i><span class='option-text'>Süd-Ost</span>"
        },
                {
            value: 'SOUTH',
            icon: "<i class='wi wi-wind from-180-deg'></i><span class='option-text'>Süd</span>"
        },
                {
            value: 'SOUTH_WEST',
            icon: "<i class='wi wi-wind from-225-deg'></i><span class='option-text'>Süd-West</span>"
        },
        {
            value: 'WEST',
            icon: "<i class='wi wi-wind from-270-deg'></i><span class='option-text'>West</span>"
        },
        {
            value: 'NORTH_WEST',
            icon: "<i class='wi wi-wind from-315-deg'></i><span class='option-text'>Nord-West</span>"
        }
    ],

    didInsertElement: function() {
        var me = this;

        this.$conditionSelectPicker = Ember.$('.selectpicker.condition').selectpicker();
        this.$windDirectionSelectPicker = Ember.$('.selectpicker.windDirection').selectpicker();

        this.$conditionSelectPicker.on('change', function(event) {
            var val = Ember.$(event.target).val();
            me.set('data.condition', val);
        });

        this.$windDirectionSelectPicker.on('change', function(event) {
            var val = Ember.$(event.target).val();
            me.set('data.windDirection', val);
        });
    },

    disabled: function() {
        var isDisabled = this.get('isDisabled');

        if(this.$conditionSelectPicker) {
            this.$conditionSelectPicker.prop('disabled', isDisabled);
            this.$conditionSelectPicker.selectpicker('refresh');
        }

        if(this.$windDirectionSelectPicker) {
            this.$windDirectionSelectPicker.prop('disabled', isDisabled);
            this.$windDirectionSelectPicker.selectpicker('refresh');
        }
        return isDisabled;
    }.property('isDisabled'),
});
