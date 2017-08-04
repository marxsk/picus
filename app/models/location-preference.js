import DS from 'ember-data';

export default DS.Model.extend({
  resource: DS.belongsTo('resource'),
  node: DS.attr('string'),
  score: DS.attr('string'),
});
