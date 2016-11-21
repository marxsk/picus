import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  readableName: DS.attr('string'),
  shortdesc: DS.attr('string'),
  longdesc: DS.attr('string'),
  source: DS.attr('string'),
  advanced: DS.attr('boolean'),
  type: DS.attr('string'),
  default: DS.attr('string'),
  value: DS.attr('string'),
  enum: DS.attr('string'),
});
