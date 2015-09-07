import DS from 'ember-data';
import AbstractBase from './abstract-base';

export default AbstractBase.extend({

    startTime: DS.attr('time'),
    totalTime: DS.attr('time'),

    timeInHeartRateZone: DS.attr('time'),
    percentInHeartRateZone: DS.attr('number'),

    calories: DS.attr('number'),
    avgHeartRate: DS.attr('number'),
    maxHeartRate: DS.attr('number'),

    // Weather
    condition: DS.attr('string'),
    temperature: DS.attr('number'),
    windDirection: DS.attr('string'),
    windSpeed: DS.attr('number'),
    windStrength: DS.attr('number'),
    windBlasts: DS.attr('number'),

    // required for form and model validation
    validation: {
        calories: {
            type: 'number',
            presence: false,
            min: 1
        },
        avgHeartRate: {
            type: 'number',
            presence: false,
            min: 1
        },
        maxHeartRate: {
            type: 'number',
            presence: false,
            min: 1
        },
        totalTime: {
            type: 'string',
            presence: false,
            pattern: {
                regexp: '^([0-9]{2}\\:)?[0-9]{2}\\:[0-9]{2}$',
                text: '00:00:00'
            }
        },
        startTime: {
            type: 'string',
            presence: false,
            pattern: {
                regexp: '^([0-9]{2}\\:)?[0-9]{2}\\:[0-9]{2}$',
                text: '00:00:00'
            }
        },
        timeInHeartRateZone: {
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
            min: 1
        },
        windStrength: {
            type: 'number',
            presence: false,
            min: 1
        },
        windBlasts: {
            type: 'number',
            presence: false,
            min: 1
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