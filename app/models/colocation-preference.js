import DS from 'ember-data';

export default DS.Model.extend({
  preferenceID: DS.attr('string'),
  resource: DS.belongsTo('resource'),
  // @note: rename to targetResourceName (or DS.belongsto?)
  targetResource: DS.attr('string'),
  colocationType: DS.attr('string'),
  score: DS.attr('string'),
});
