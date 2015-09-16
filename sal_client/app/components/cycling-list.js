import Ember from 'ember';
import BaseList from './base-list';

export default BaseList.extend({

    didInsertElement: function() {
        var $table = Ember.$('#cycling-dataTables');
        this.renderTable($table, this.get('cyclings'), this.getColumnsConfig());
    },

    updateCyclings: function() {
        this.updateTable(this.get('cyclings'));
    }.observes('cyclings'),

    getColumnsConfig: function() {
        return [
            {
                title: 'Datum',
                data: 'date',
                defaultContent: '',
                render: function (data) {
                    if(data && moment(data).isValid()) {
                        return moment(data).format('DD.MM.YYYY');
                    }
                    return '';
                }
            },
            {
                title: 'Strecke gesamt',
                data: 'totalKm',
                defaultContent: ''
            },
            {
                title: 'Durchschnitt',
                data: 'avgSpeed',
                defaultContent: ''
            },
            {
                title: 'Zeit gesamt',
                data: 'totalTime',
                defaultContent: ''
            },
            {
                title: 'Zeit 20km',
                data: 'time20',
                defaultContent: ''
            },
            {
                title: 'Zeit 30km',
                data: 'time30',
                defaultContent: ''
            },
            {
                orderable: false,
                render: function(data, type, full) {
                    return '<a href="#/cycling/'+full.id+'"><i class="fa fa-info"></i></a>';
                }
            }
        ];
    }
});
