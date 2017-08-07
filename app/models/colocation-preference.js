import DS from 'ember-data';

export default DS.Model.extend({
    resource: DS.belongsTo('resource'),
    // @note: rename to targetResourceName (or DS.belongsto?)
    targetResource: DS.attr('string'),
    colocationType: DS.attr('string'),
    score: DS.attr('string'),
});
