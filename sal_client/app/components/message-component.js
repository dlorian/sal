import Ember from 'ember';

export default Ember.Component.extend({
    attributeBindings:['errorMessages', 'successMessages'],

    elementId: 'message-component',

    /**
     * jQuery element of the message component
     * @type {[type]}
     */
    $messageComponent: null,

    // View-Porperties
    visible: false,     // true to show message view

    /**
     * Stores all error messages whch needs to be displayed.
     * @type {Array}
     */
    errorMessages: null,

    /**
     * Stores all success messages whch needs to be displayed.
     * @type {Array}
     */
    successMessages: null,

    /**
     * Determines if the component needs to be visible
     */
    isVisible: function() {
        var errorMessages = this.get('errorMessages');
        var successMessages = this.get('successMessages');

        var isVisible = (errorMessages   && errorMessages.length   > 0   ||
                         successMessages && successMessages.length > 0);

        this.set('visible', isVisible);
    }.property('errorMessages.[]', 'successMessages.[]'),

    didInsertElement: function() {
        var messageComponent = Ember.$('#'+this.get('elementId'))
        this.set('$messageComponent', messageComponent);
    },

    willDestroyElement: function() {
        // If the route changes, the deactivate hook is triggered.
        // Then we have to set the state of the controller to
        // default state
        this.setProperties({
            visible: false
        });

        var errorMessages = this.get('errorMessages');
        var successMessages = this.get('successMessages');

        if(errorMessages) {
            errorMessages.clear();
        }

        if(successMessages) {
            successMessages.clear();
        }
    },

    hideErrorMessage: function(message) {
        this.get('errorMessages').removeObject(message);
    },

    hideSuccessMessage: function(message) {
        this.get('successMessages').removeObject(message)
    },

    actions: {
        hideSuccessMessage: function(message) {
            this.hideSuccessMessage(message);
        },
        hideErrorMessage: function(message) {
            this.hideErrorMessage(message);
        }
    }
});