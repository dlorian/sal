import Ember from 'ember';
import Validator from '../validators/validator';

export default Ember.Component.extend({
    attributeBindings:['isDisabled'],

    // Validation error css properties
    errorClass: 'has-error has-feedback',
    errorFeedbackEl: '<span class="glyphicon glyphicon-remove form-control-feedback"></span>',

    // Validation success css properties
    successClass: 'has-success has-feedback',
    successFeedbackEl: '<span class="glyphicon glyphicon-ok form-control-feedback"></span>',

    // Added to the form-group in case of an invalid date. Used for displaying an error message.
    validationMsgEl: '<span id="validationMsg" class="help-block"></span>',

    // Cache for used jQuery objects
    $formContainer: null,
    $formFields: [],

    successMessageList: [],

    disabled: function() {
        return this.get('isDisabled');
    }.property('isDisabled'),

    editDisabled: function() {
        return !this.get('isDisabled');
    }.property('isDisabled'),

    isNew: function() {
        return this.get('model.isNew');
    }.property('model'),

    successMessages: function() {
        return this.get('successMessageList');
    }.property('successMessageList.[]'),

    errorMessageList: [],

    errorMessages: function() {
        return this.get('errorMessageList');
    }.property('errorMessageList.[]'),

    didInsertElement: function() {
        var me = this;

        // Cache elements
        this.$formContainer = Ember.$('#running-form');
        this.$formFields = this.$formContainer.find('input.validate');

        // Add event listener for change evet to valdiate an input
        this.$formFields.each(function(index, field) {
            // Validate field on value change
            Ember.$(field).change(function(event) {
                me.validateField(event.target);
            });
        });
    },

    /**
     * Validates all fields of the form.
     * @return {Boolean} Returns true, if the input of all fields is vaild.
     *                   Returns false, if the input of one field is invalid.
     */
    validateForm: function() {
        var me = this;
        var isValid = true;
        this.$formFields.each(function(index, field) {
            if(!me.validateField(field)) {
                // if one field is invalid, the whole form is invalid
                isValid = false;
            }
        });
        return isValid;
    },

    /**
     * Validates the input of the given form field.
     * @param  {String} field jQuery-Selector of the form field.
     * @return {Boolean} returns true if the input of the field is valid, else false.
     */
    validateField: function(field) {
        var me = this;

        // Create new validator instance
        var validator = new Validator();

        var error = validator.validateField(Ember.$(field).attr('name'), this.get('model'));

        var isValid = (error) ? false : true;
        // Mark fields of form as valid or invalid.
        if(isValid) {
            this.markFieldAsValid(field);
        }
        else {
            Ember.$.each(error, function(index, err) {
                me.markFieldAsInvalid(field, err.validationMsg);
            });
        }

        return isValid;
    },

    /**
     * Marks the input of the field as valid.
     * @param  {String} field jQuery-Selector of the form field.
     */
    markFieldAsValid: function(field) {
        var parentDiv = Ember.$(field).parents('div.form-group');

        // Remove possible error indications
        parentDiv.removeClass(this.errorClass);
        parentDiv.find('.form-control-feedback').remove();
        this.hideHelpForField(field);

        // Add error indications to the element
        parentDiv.addClass(this.successClass);
        Ember.$(this.successFeedbackEl).insertAfter(field);
    },

    unmarkFieldAsValid: function(field) {
        var parentDiv = Ember.$(field).parents('div.form-group');

        // Remove possible error indications
        parentDiv.removeClass(this.successClass);
        parentDiv.find('.form-control-feedback').remove();
    },

    /**
     * Marks the input of the form field as invalid.
     * @param  {String} field jQuery-Selector of the form field.
     * @param  {String} validationMsg Information message to display for input correction.
     */
    markFieldAsInvalid: function(field, validationMsg) {
        var parentDiv = Ember.$(field).parents('div.form-group');

        // Remove possible success indications
        parentDiv.removeClass(this.successClass);
        parentDiv.find('.form-control-feedback').remove();

        // Add success indications to the element
        parentDiv.addClass(this.errorClass);
        Ember.$(this.errorFeedbackEl).insertAfter(field);
        this.showHelpForField(field, validationMsg);
    },

    hideValidations: function() {
        var me = this;
        this.$formFields.each(function(index, field) {
            me.unmarkFieldAsValid(field);
        });
    },

    /**
     * Shows the information help box for the given form field
     * @param  {String} field jQuery-Selector of the form field
     * @param  {String} validationMsg Displayes message of the help box.
     */
    showHelpForField: function(field, validationMsg) {
        if(validationMsg) {
            var helpBlock = Ember.$(field).siblings('.help-block');
            // If block already exists, show message only
            if(helpBlock.length) {
                helpBlock.html(validationMsg);
            }
            else {
               Ember.$(this.validationMsgEl).insertAfter(field).html(validationMsg);
            }
        }
    },

    /**
     * Hides the information help box for the given form field
     * @param  {String} jQuery-Selector of the form field
     */
    hideHelpForField: function(field) {
        Ember.$(field).siblings('.help-block').remove();
    },

    save: function(model) {
        var me = this;
        var onSuccess = function(model) {
            me.get('successMessageList').pushObject('Erfolgreich gespeichert!');
            me.hideValidations();
            me.set('isDisabled', true);
        };

        var onFail = function(response) {
            me.get('errorMessageList').push('Fehler beim Speichern!');

        }

        // if form ist valid, save model
        if(this.validateForm()) {
            model.save().then(onSuccess, onFail);
        }
        else {
            me.get('errorMessageList').pushObject('Bitte die Eingaben überprüfen.');
        }
    },

    actions: {
        save: function(model) {
            this.save(model);
        },
        edit: function() {
            this.set('isDisabled', false);
        }
    }
});