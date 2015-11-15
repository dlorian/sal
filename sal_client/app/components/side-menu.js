import Ember from 'ember';

export default Ember.Component.extend({
    attributeBindings:['loggedInUser'],

    $sideMenu: null,

    refreshSideMenuTimeout: null,

    didInsertElement: function() {
        var me = this;

        this.$sideMenu = $('#side-menu')
        this.$sideMenu.metisMenu();

        this.$sideMenu.on('DOMNodeInserted', function() {
            // Run side menu refresh only once
            var existingTimeout = me.get('refreshSideMenuTimeout');
            if(existingTimeout) {
                clearTimeout(existingTimeout);
            }

            var timeout = setTimeout(me.refreshSideMenu.bind(me), 0);
            me.set('refreshSideMenuTimeout', timeout);
        });
    },

    isLoggedIn: function() {
        var user = this.get('loggedInUser');
        return (user && user.isLoggedIn);
    }.property('loggedInUser'),

    refreshSideMenu: function() {
        console.log('To the refresh')
        this.$sideMenu.metisMenu();

        // Function of time executed
        this.set('refreshSideMenuTimeout', null);
    }

});
