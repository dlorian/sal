import DS from 'ember-data';
import AbstractBase from './abstract-base';

export default AbstractBase.extend({

    // Times
    time20: DS.attr('time'),
    time30: DS.attr('time'),
    totalTime: DS.attr('time'),

    // Track
    totalKm: DS.attr('number'),
    avgSpeed: DS.attr('number'),
    topSpeed: DS.attr('number'),

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
            type: 'number',
            presence: false,
            min: 0
        },
        topSpeed: {
            type: 'number',
            presence: false,
            min: 0
        },
        totalKm: {
            type: 'number',
            presence: false,
            min: 0
        },
        time20: {
            type: 'string',
            presence: false,
            pattern: {
                regexp: '^([0-9]{2}\\:)?[0-9]{2}\\:[0-9]{2}$',
                text: '00:00:00'
            }
        },
        time30: {
            type: 'string',
            presence: false,
            pattern: {
                regexp: '^([0-9]{2}\\:)?[0-9]{2}\\:[0-9]{2}$',
                text: '00:00:00'
            }
        },
        totalTime: {
            type: 'string',
            presence: false,
            pattern: {
                regexp: '^([0-9]{2}\\:)?[0-9]{2}\\:[0-9]{2}$',
                text: '00:00:00'
            }
        },
        windSpeed: {
            type: 'number',
            presence: false,
            min: 0
        },
        windStrength: {
            type: 'number',
            presence: false,
            min: 0
        },
        windBlasts: {
            type: 'number',
            presence: false,
            min: 0
        },
        temperature: {
            type: 'string',
            presence: false,
            pattern: '^(-)?[0-9]{1,2}((\\.|\\,)[0-9]{1,2})?$'
        },
        condition: {
            type: 'string',
            presence: false
        },
        windDirection: {
            type: 'string',
            presence: false
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
