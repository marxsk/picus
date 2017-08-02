import DS from 'ember-data';

export default DS.Model.extend({
    targetResource: DS.attr('string'),
    colocationType: DS.attr('string'),
    score: DS.attr('string'),
});
