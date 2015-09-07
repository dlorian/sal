import Ember from 'ember';

export function formatDatetime(params) {
    var date = params[0];
    if(date && moment(date).isValid()) {
        return moment(date).format('DD.MM.YYYY HH:mm:ss');
    }
    return null;
};

export default Ember.Helper.helper(formatDatetime);