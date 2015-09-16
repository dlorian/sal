import Ember from 'ember';

export default Ember.Component.extend({
    /**
     * Stores an instance of the created datatable
     * @type {Object}
     */
    dataTable: null,

    didInsertElement: function() {
        this.renderTable(this.getTableData(this.get('cyclings')));
    },

    updateList: function() {
        this.updateTable(this.getTableData(this.get('cyclings')));
    }.observes('cyclings'),

    updateTable: function(data) {
        var table = this.get('dataTable');
        // Clear existing data
        table.clear();

        // Add new data
        table.rows().invalidate();
        table.rows.add(data).draw();
    },

    getTableData: function(cyclings) {
        var dataItem = null, dataItems = [];

        cyclings.forEach(function(item) {
            dataItem = item.get('data');
            dataItem.id = item.get('id');
            dataItems.push(dataItem);
        });

        return dataItems.toArray();
    },

    renderTable: function(data) {
        Ember.$.fn.dataTable.moment('DD.MM.YYYY');
        var table = Ember.$('#cycling-dataTables').DataTable({
            // language: {
            //     url: "/i18n/German.lang"
            // },
            responsive: true,
            retrieve: true,
            data: data,
            columns: [
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
            ]
        });

        this.set('dataTable', table);
    }
});
