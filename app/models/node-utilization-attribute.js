import DS from 'ember-data';

export default DS.Model.extend({
  node: DS.belongsTo('node'),
  name: DS.attr('string'),
  value: DS.attr('string'),
});
