import Ember from 'ember';

export default Ember.Component.extend({
    // View-Porperties
    visible: true,     // true to show message view
    success: false,     // true to show that save was successful
    //errorMessages: [],  // errMsg to show if save was not successful
    //successMessages: [],  // errMsg to show if save was not successful

    isVisible: function() {
        return this.get('visible');
    }.property('errorMessages', 'visible'),

    init: function() {
        this._super();
        debugger
    },

    willDestroyElement: function() {
        // If the route changes, the deactivate hook is triggered.
        // Then we have to set the state of the controller to
        // default state
        this.setProperties({
            visible: false,
            success: false
        });

        this.get('errorMessages').clear();

        // We also need to remove all listeners.
        var controller = this.get('controller');
        controller.off('successMessage', this, this.successMessageListener);
        controller.off('failureMessage', this, this.failureMessageListener);
    },

    successMessageListener: function() {
        // true to show success message
        this.showMessage(true);
    },

    failureMessageListener: function(err) {
        // false to show success message
        this.showMessage(false, err.error);
    },

    showMessage: function(success, error) {
        var me = this;

        this.set('visible', true);
        this.set('success', success);

        var errorMessages = this.get('errorMessages');
        if(error && error.message) {
            errorMessages.pushObject({ message: error.message });
        }
        else if(error) {
            errorMessages.pushObject({ message: error });
        }

        $('#message-view').fadeIn(400);

        if(success) {
            Ember.run.later(function() {
                me.hideMessage();
            }, 2000);
        }
    },

    hideMessage: function(message) {
        var me = this, errorMessages = this.get('errorMessages');

        if(message) {
            if(errorMessages.length === 1) {
                $('#message-view').fadeOut(400, function(){
                    errorMessages.removeObject(message);
                    me.set('visible', false);
                });
            }
            else {
                errorMessages.removeObject(message);
            }

        }
        else if(errorMessages.length === 0) {
            $('#message-view').fadeOut(400, function(){
                errorMessages.removeObject(message);
                me.set('visible', false);
            });
        }
    },

    actions: {
        hide: function(message) {
            this.hideMessage(message);
        }
    }
});