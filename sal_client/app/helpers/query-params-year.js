import Ember from 'ember';

export function queryParamsYear(params) {
    var year = params[0];

    var from = 'from='+year+'-01-01';
    var to = 'to='+year+'-12-31';

    return from + '&' + to;
}

export default Ember.Helper.helper(queryParamsYear);