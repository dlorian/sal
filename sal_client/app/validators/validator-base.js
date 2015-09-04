import Ember from 'ember';

export default Ember.Object.extend({

    validationMessages: {
        presence: 'Eingabe erforderlich!'
    },

    // holds the validation configuration
    validatorConfig: {},

    init: function() {
        // Initialize the base validation configuration
        var config = {
            'presence': this.presenceValidator
        };
        this.set('validatorConfig', config);
    },

    addValidatorConfig: function(config) {
        $.extend(this.validatorConfig, config);
    },

    validate: function(fieldValidation, field, fieldValue) {
        var me = this;
        Ember.$.each(fieldValidation, function(name, validator) {
            try {
                if(!me.validatorConfig[name]) {
                    var error = me.createValidatorError('Invalid validator "' + validator + '" for field "' + field) + '"';
                    throw error;
                }
                // use call for providing the correct this scope
                me.validatorConfig[name].call(me, validator, field, fieldValue);
            }
            catch(err) {
                if(err.type === 'ValidationError' || err.type === 'ValidatorError') {
                    throw err;
                }
                else {
                    throw new Error('Undefined error while validation of field '+field+' occured. ' + err.message);
                }
            }
        });
    },

    /**
     * Creates a custom validation error which indicates an invalid value.
     * @param errMsg: Usual error message used for console logging.
     * @param validationMsg: Special validation message used for displaying validation error in the UI.
     * @return Retuns an error object with error type 'ValidationError' an the given messages.
     */
    createValidationError: function(errMsg, validationMsg) {
        var formatRe = /\{(\d+)\}/g;
        var args = Array.prototype.slice.call(arguments, 2); // start from index 2

        var string = validationMsg.replace(formatRe, function(m, i) {
            return args[i];
        });

        var errorObj = {type: 'ValidationError'};
        if(errMsg) {
            errorObj.message = 'Validation Error: ' + errMsg;
        }
        if(validationMsg) {
            errorObj.validationMessage = string;
        }
        return errorObj;
    },

    /**
     * Creates a custom validator error which indicates an invalid validator config.
     * @param errMsg: Usual error message used for console logging.
     * @param validationMsg: Special validation message used for displaying validation error in the UI.
     * @return Retuns an error object with error type 'ValidationError' an the given messages.
     */
    createValidatorError: function(errMsg) {
        var errorObj = {type: 'ValidatorError'};
        if(errMsg) {
            errorObj.message = 'Validator Error: ' + errMsg;
        }
        return errorObj;
    },

    /**
     * Validator function used for presence validation.
     * Verifies that fieldValue is set if the presence validator is true.
     */
    presenceValidator: function(validator, field, fieldValue) {
        if(validator === true) {
            if(!fieldValue || fieldValue === '') {
                var errMsg = 'A value for "' + field + '" is required but not defined.';
                var err = this.createValidationError(errMsg, this.validationMessages['presence']);
                throw err;
            }
        }
    }
});