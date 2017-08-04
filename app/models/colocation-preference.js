import DS from 'ember-data';

export default DS.Model.extend({
    resource: DS.belongsTo('resource'),
    targetResource: DS.attr('string'),
    colocationType: DS.attr('string'),
    score: DS.attr('string'),
});
