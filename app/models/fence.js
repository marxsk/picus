import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  agentType: DS.attr('string'),
  properties: DS.hasMany('fenceProperty'),
});
