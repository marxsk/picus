import DS from 'ember-data';

export default DS.Model.extend({
  preferenceID: DS.attr('string'),
  cluster: DS.belongsTo('cluster'),
  resourceSets: DS.hasMany('resource-set'),
  type: DS.attr('string'),

  // @refactor required?
  // unique attributes for 'ticket' set preferences
  ticket: DS.attr('string'),
  lossPolicy: DS.attr('string'),
});
