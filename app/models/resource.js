import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  status: DS.attr('string'),  // @todo: define a set of possible values
  resourceType: DS.attr('string'), // @todo: define a set of possible values
  resourceProvider: DS.attr('string'), // @todo: define a set of possible values
  resources: DS.hasMany('resource', {
    inverse: null,
    async: true,
  }),
  properties: DS.hasMany('resourceProperty'),

  metaAttributes: DS.hasMany('attribute'),
});
