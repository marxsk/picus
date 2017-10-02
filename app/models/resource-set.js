import DS from 'ember-data';

export default DS.Model.extend({
  constraintSet: DS.belongsTo('constraint-set'),
  resources: DS.hasMany('resource'),
});
