import DS from 'ember-data';

export default DS.Model.extend({
  cluster: DS.belongsTo('cluster'),
  resourceSets: DS.hasMany('resource-set'),
});
