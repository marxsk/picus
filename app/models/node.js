import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  recordId: DS.attr('string'), // @note: = ID in cluster config
  status: DS.attr('string'), // @todo: define a set of possible values

  nodeAttributes: DS.hasMany('attribute'),
  nodeUtilizationAttributes: DS.hasMany('attribute'),

  isCorosyncEnabled: DS.attr('boolean'),
  isCorosyncRunning: DS.attr('boolean'),
  isPacemakerEnabled: DS.attr('boolean'),
  isPacemakerRunning: DS.attr('boolean'),
  isPcsdEnabled: DS.attr('boolean'),
  isPcsdRunning: DS.attr('boolean'),
});
