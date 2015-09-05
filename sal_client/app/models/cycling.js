import DS from 'ember-data';

export default DS.Model.extend({
    // General
    date: DS.attr('date', {
        defaultValue: function() {
            return new Date();
        }
    }),
    description: DS.attr('string'),

    // Times
    time20: DS.attr('time'),
    time30: DS.attr('time'),
    totalTime: DS.attr('time'),

    // Track
    totalKm: DS.attr('string'),
    avgSpeed: DS.attr('string'),
    topSpeed: DS.attr('string'),

    // Weather
    condition: DS.attr('string'),
    temperature: DS.attr('number'),
    windDirection: DS.attr('string'),
    windSpeed: DS.attr('number'),
    windStrength: DS.attr('number'),
    windBlasts: DS.attr('number'),

    // required for form and model validation
    validation: {
        avgSpeed: {
            type: 'string',
            presence: true,
            pattern: {
                regexp: '^[0-9]{1,3}((\\.|\\,)[0-9]{1,2})?$',
                text: '000.00 oder 000,00'
            }
        },
        topSpeed: {
            type: 'string',
            presence: true,
            pattern: {
                regexp: '^[0-9]{1,3}((\\.|\\,)[0-9]{1,2})?$',
                text: '000.00 oder 000,00'
            }
        },
        totalKm: {
            type: 'string',
            presence: true,
            pattern: {
                regexp: '^[0-9]{1,3}((\\.|\\,)[0-9]{1,2})?$',
                text: '000.00 oder 000,00'
            }
        },
        time20: {
            type: 'string',
            presence: true,
            pattern: {
                regexp: '^([0-9]{2}\\:)?[0-9]{2}\\:[0-9]{2}$',
                text: '00:00:00'
            }
        },
        time30: {
            type: 'string',
            presence: true,
            pattern: {
                regexp: '^([0-9]{2}\\:)?[0-9]{2}\\:[0-9]{2}$',
                text: '00:00:00'
            }
        },
        totalTime: {
            type: 'string',
            presence: true,
            pattern: {
                regexp: '^([0-9]{2}\\:)?[0-9]{2}\\:[0-9]{2}$',
                text: '00:00:00'
            }
        },
        windSpeed: {
            type: 'number',
            presence: true,
            min: 1
        },
        windStrength: {
            type: 'number',
            presence: true,
            min: 1
        },
        windBlasts: {
            type: 'number',
            presence: true,
            min: 1
        },
        temperature: {
            type: 'string',
            presence: true,
            pattern: '^(-)?[0-9]{1,2}((\\.|\\,)[0-9]{1,2})?$'
        },
        condition: {
            type: 'string',
            presence: true
        },
        windDirection: {
            type: 'string',
            presence: true
        },
        date: {
            type: 'date',
            presence: true
            //format: 'dd.mm.yyyy'
        },
        description: {
            type: 'string'
        }
    }
});
