import Ember from 'ember';
import ValidatorBase  from './validator-base';

export default ValidatorBase.extend({

    stringValidationMessage: {
        'type': 'Der eingegeben Wert entspricht keinem String.',
        'pattern': 'Der eingebene Wert entspricht nicht dem vorgegebenen Muster ({0}).',
    },

    init: function() {
        this._super();
        var config = {
            'type': this.typeValidator,
            'pattern': this.patternValidator,
        };
        Ember.$.extend(this.validatorConfig, config);
    },

    typeValidator: function(validator, field, fieldValue) {
        if(fieldValue && typeof fieldValue !== 'string') {
            var errMsg = 'Given value '+ fieldValue + ' for field "' + field + '" is no type of string as expected.';
            var validationMsg = this.stringValidationMessage['type'];
            var error = this.createValidationError(errMsg, validationMsg, validator);
            throw error;
        }
    },

    patternValidator: function(validator, field, fieldValue) {
        var error, errMsg, validationMsg, pattern = null, text = null;
        if(typeof validator === 'string') {
            pattern = validator;
        }
        else if(typeof validator === 'object') {
            pattern = validator.regexp;
            text = validator.text;
        }

        // The Regular Expression for pattern validation has to be defined as string.
        if(!pattern || typeof pattern !== 'string') {
            errMsg = 'Invalid pattern validator. No Regular Expression string for pattern comparison defined';
            error = this.createValidatorError(errMsg);
            throw error;
        }

        if(fieldValue && fieldValue.length > 0) {
            // Create a new Regular Expression for the given pattern string.
            var regexp = new RegExp(pattern, 'g');
            if(!regexp.test(fieldValue)) {
                errMsg = 'Given value "'+ fieldValue + '" for field "' + field + '" does not match validation pattern.';
                validationMsg = this.stringValidationMessage['pattern'];
                error = this.createValidationError(errMsg, validationMsg, text);
                throw error;
            }
        }
    }
});