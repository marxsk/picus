import DS from 'ember-data';

export default DS.Model.extend({
  node: DS.attr('string'),
  score: DS.attr('string'),
});
