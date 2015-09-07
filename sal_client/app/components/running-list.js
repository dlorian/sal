import Ember from 'ember';

export default Ember.Component.extend({
        didInsertElement: function() {
        var dataItem = null, dataItems = [];

        this.get('runnings').forEach(function(item) {
            dataItem = item.get('data');
            dataItem.id = item.get('id');
            dataItems.push(dataItem);
        });

        Ember.$('#running-dataTables').DataTable({
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
            ]
        });
    }

});
