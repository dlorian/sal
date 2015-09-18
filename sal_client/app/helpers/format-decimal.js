import Ember from 'ember';

export function formatDecimal(params) {
    var value = params[0];
    if(value && !isNaN(value)) {
        var big = new Big(value);
        return big.toFixed(2);
    }
    return null;
};

export default Ember.Helper.helper(formatDecimal);
