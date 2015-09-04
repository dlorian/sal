export default Ember.Object.extend({

    validatorConfig: {},

    init: function() {
        // Initialize a hash used for validation
        var config = {
            'type': this.typeValidator
        };
        this.set('validatorConfig', config);
    },

    typeValidator: function(fieldValue) {
        if(typeof value !== 'function') {
            throw new Error('Given value '+ fieldValue +' is no type of function as expected.');
        }
    }
});