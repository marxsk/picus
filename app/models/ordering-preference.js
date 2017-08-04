import DS from 'ember-data';

export default DS.Model.extend({
  resource: DS.belongsTo('resource'),
  targetResource: DS.attr('string'),
  targetAction: DS.attr('string'),
  order: DS.attr('string'),
  action: DS.attr('string'),
  score: DS.attr('string'),
});
