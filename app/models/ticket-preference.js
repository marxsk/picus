import DS from 'ember-data';

export default DS.Model.extend({
  preferenceID: DS.attr('string'),
  resource: DS.belongsTo('resource'),
  ticket: DS.attr('string'),
  role: DS.attr('string'),
  lossPolicy: DS.attr('string'),
});
