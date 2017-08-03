import DS from 'ember-data';

export default DS.Model.extend({
  ticket: DS.attr('string'),
  role: DS.attr('string'),
  lossPolicy: DS.attr('string'),
});
