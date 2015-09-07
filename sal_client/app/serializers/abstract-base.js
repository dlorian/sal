import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    attrs: {
        createdBy: {
            serialize: 'records',
            deserialize: 'records'
        }
    }
});
