import Ember from 'ember';
import BaseList from './base-list';

export default BaseList.extend({

    didInsertElement: function() {
        var $table = Ember.$('#running-dataTables');
        this.renderTable($table, this.get('runnings'), this.getColumnsConfig());
    },

    updateRunnungs: function() {
        this.updateTable(this.get('runnings'));
    }.observes('runnings'),

    getColumnsConfig: function() {
        return [
            {
                title: 'Datum',
                data: 'date',
                defaultContent: '',
                render: function (data, type, full, meta ) {
                    if(data && moment(data).isValid()) {
                        return moment(data).format('DD.MM.YYYY');
                    }
                    return '';
                }
            },
            {
                title: 'Zeit gesamt',
                data: 'totalTime',
                defaultContent: ''
            },
            {
                title: 'Puls Durchschn.',
                data: 'avgHeartRate',
                defaultContent: ''
            },
            {
                title: 'Puls Max.',
                data: 'maxHeartRate',
                defaultContent: ''
            },
            {
                orderable: false,
                render: function(data, type, full, meta) {
                    return '<a href="#/running/'+full.id+'"><i class="fa fa-info"></i></a>';
                }
            }
        ];
    }
});
