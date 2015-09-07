import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    isNewSerializerAPI: true,
    attrs: {
        createdBy: { embedded: 'always' },
        modifiedBy: { embedded: 'always' }
    }
});