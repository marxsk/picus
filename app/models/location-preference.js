import DS from 'ember-data';

export default DS.Model.extend({
  preferenceID: DS.attr('string'),
  resource: DS.belongsTo('resource'),
  node: DS.attr('string'),
  score: DS.attr('string'),
});
