import DS from 'ember-data';

export default DS.Model.extend({
  permissionID: DS.attr('string'),
  role: DS.belongsTo('aclRole'),

  operation: DS.attr('string'),
  xpath: DS.attr('string'),
  query: DS.attr('string'),
});
