import DS from 'ember-data';

export default DS.Model.extend({
  cluster: DS.belongsTo('cluster'),
  name: DS.attr('string'),
  description: DS.attr('string'),
  permissions: DS.hasMany('aclPermissions'),
});
