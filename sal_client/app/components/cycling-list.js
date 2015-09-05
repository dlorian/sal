import Ember from 'ember';

export default Ember.Component.extend({

    didInsertElement: function() {
        var dataItem = null, dataItems = [];

        this.get('cyclings').forEach(function(item) {
            dataItem = item.get('data');
            dataItem.id = item.get('id');
            dataItems.push(dataItem);
        });

        Ember.$('#cycling-dataTables').DataTable({
            language: {
                url: "/i18n/German.lang"
            },
            responsive: true,
            data: dataItems.toArray(),
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
                    render: function(data, type, full, meta) {
                        return '<a href="#/cycling/'+full.id+'"><i class="fa fa-info"></i></a>';
                    }
                }
            ]
        });
    }
});
