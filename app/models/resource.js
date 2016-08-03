import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  status: DS.attr('string'),  // @todo: define a set of possible values
  resourceType: DS.attr('string'), // @todo: define a set of possible values
  children: DS.hasMany('resource', {
    inverse: null,
    async: true,
  }),
});
