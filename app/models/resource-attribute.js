import DS from 'ember-data';

export default DS.Model.extend({
  resource: DS.belongsTo('resource'),
  key: DS.attr('string'),
  value: DS.attr('string'),
});
