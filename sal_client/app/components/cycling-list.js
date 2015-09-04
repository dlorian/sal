import Ember from 'ember';

export default Ember.Component.extend({

    didInsertElement: function() {
        debugger
        var cyclings = this.get('cyclings');
        var data = [];

        cyclings.forEach(function(item) {
            data.push(item.get('data'));
        });
        Ember.$('#cycling-dataTables').DataTable({
            responsive: true,
            data: data.toArray(),
            columns: [
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
                    title: 'Strecke gesamt',
                    data: 'totalKm',
                    defaultContent: ''
                },
                {
                    title: 'Beschreibung',
                    data: 'description',
                    defaultContent: ''
                }
            ]
        });
    }
});
