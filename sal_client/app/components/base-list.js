import Ember from 'ember';

export default Ember.Component.extend({

    /**
     * Stores an instance of the created datatable
     * @type {Object}
     */
    dataTable: null,

    updateTable: function(model) {
        var data = this.getTableData(model);

        var table = this.get('dataTable');
        if(table) {
            // Clear existing data
            table.clear();

            // Add new data
            table.rows().invalidate();
            table.rows.add(data).draw();
        }
    },

    getTableData: function(model) {
        var dataItem = null, dataItems = [];

        model.forEach(function(item) {
            dataItem = item.get('data');
            dataItem.id = item.get('id');
            dataItems.push(dataItem);
        });

        return dataItems.toArray();
    },

    renderTable: function($table, model, columns) {
        var data = this.getTableData(model);

        Ember.$.fn.dataTable.moment('DD.MM.YYYY');

        var table = $table.DataTable({
            // language: {
            //     url: "/i18n/German.lang"
            // },
            responsive: true,
            retrieve: true,
            data: data,
            columns: columns
        });

        this.set('dataTable', table);
    }
});