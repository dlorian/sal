import Ember from 'ember';

export function formatDate(params) {
    var date = params[0];
    if(date && moment(date).isValid()) {
        return moment(date).format('DD.MM.YYYY');
    }
    return null;
};

export default Ember.Helper.helper(formatDate);