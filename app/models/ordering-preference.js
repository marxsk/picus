import DS from 'ember-data';

export default DS.Model.extend({
  targetResource: DS.attr('string'),
  targetAction: DS.attr('string'),
  order: DS.attr('string'),
  action: DS.attr('string'),
  score: DS.attr('string'),
});
