import Ember from 'ember';

export default Ember.Object.extend({
    appNamespace: 'api',

    getNamespace: function() {
        var pathname = window.location.pathname;
        if(pathname.startsWith('/')) {
            pathname = pathname.substr(1);
        }
        return (pathname.length > 0) ? pathname + this.get('appNamespace') : this.get('appNamespace');
    }
});