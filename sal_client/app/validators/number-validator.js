import Ember from 'ember';
import ValidatorBase  from './validator-base';

export default ValidatorBase.extend({

    numberValidationMessage: {
        'type': 'Der eingegeben Wert entspricht nicht einer Zahl. Bitte eine Zahl angeben.',
        'min': 'Der eingebene Wert muss größer als {0} sein.',
        'max': 'Der eingebene Wert muss kleiner als {0} sein.',
        'equal': 'Der eingebene Wert muss gleich als {0} sein.',
    },

    init: function() {
        this._super();
        // Initialize a hash used for validation
        var config = {
            'type': this.typeValidator,
            'min': this.minValidator,
            'max': this.maxValidator,
            'equal': this.equalValidator,
        };
        Ember.$.extend(this.validatorConfig, config);
    },

    typeValidator: function(validator, field, fieldValue) {
        var error, errMsg, validationMsg;
        if(fieldValue && !Ember.$.isNumeric(fieldValue)) { // can be a string as a number
            errMsg = 'Given value '+ fieldValue +' is no type of number as expected.';
            validationMsg = this.numberValidationMessage['type'];
            error = this.createValidationError(errMsg, validationMsg);
            throw error;
        }
    },

    minValidator: function(validator, field, fieldValue) {
        var error, errMsg, validationMsg;
        if(typeof validator !== 'number') {
            errMsg = 'Invalid value for validator. Number expected for min validation.';
            error = this.createValidatorError(errMsg);
            throw error;
        }
        if(fieldValue < validator) {
            errMsg = 'Invalid value '+ fieldValue +'. The value must be greater than '+ validator +'.';
            validationMsg = this.numberValidationMessage['min'];
            error = this.createValidationError(errMsg, validationMsg, validator);
            throw error;
        }
    },

    maxValidator: function(validator, field, fieldValue) {
        var error, errMsg, validationMsg;
        if(typeof validator !== 'number') {
            errMsg = 'Invalid value for validation. Number expected for min validation';
            error = this.createValidatorError(errMsg);
            throw error;
        }
        if(fieldValue > validator) {
            errMsg = 'Invalid value '+ fieldValue +'. The value must be smaller than '+ validator +'.';
            validationMsg = this.numberValidationMessage['max'];
            error = this.createValidationError(errMsg, validationMsg, validator);
            throw error;
        }
    },

    equalValidator: function(validator, field, fieldValue) {
        var error, errMsg, validationMsg;
        if(typeof validator !== 'number') {
            errMsg = 'Invalid value for validation. Number expected for min validation';
            error = this.createValidatorError(errMsg);
            throw error;
        }
        if(fieldValue !== validator) {
            errMsg = 'Invalid value '+ fieldValue +'. The value must be equal '+ validator +'.';
            validationMsg = this.numberValidationMessage['equal'];
            error = this.createValidationError(errMsg, validationMsg, validator);
            throw error;
        }
    }
});