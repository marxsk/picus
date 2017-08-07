import DS from 'ember-data';

export default DS.Model.extend({
  resource: DS.belongsTo('resource'),
  // @note: rename to targetResourceName (or DS.belongsto?)
  targetResource: DS.attr('string'),
  targetAction: DS.attr('string'),
  order: DS.attr('string'),
  action: DS.attr('string'),
  score: DS.attr('string'),
});
