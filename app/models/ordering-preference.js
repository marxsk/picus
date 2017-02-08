import DS from 'ember-data';

export default DS.Model.extend({
  resource2: DS.attr('string'),
  action1: DS.attr('string'),
  before: DS.attr('string'),
  action2: DS.attr('string'),
  score: DS.attr('string'),
});
