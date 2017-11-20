import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  status: DS.attr('string'),  // @todo: define a set of possible values
  nodes: DS.hasMany('node'),
  resources: DS.hasMany('resource'),
  properties: DS.hasMany('property'),
  fences: DS.hasMany('fence'),
  aclRoles: DS.hasMany('aclRole'),

  constraintSets: DS.hasMany('constraintSet'),
});
