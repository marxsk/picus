import DS from 'ember-data';

export default DS.Model.extend({
  resource: DS.belongsTo('resource'),
  name: DS.attr('string'),
  value: DS.attr('string'),
});
