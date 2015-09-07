import Ember from 'ember';

export default Ember.Component.extend({

    didInsertElement: function() {
        debugger
        $('#side-menu').metisMenu();
    }
});
