import Ember from 'ember';

export function incrementIndex(params) {
    var index = parseInt(params);
    return (index + 1).toString();
}

export default Ember.Helper.helper(incrementIndex);