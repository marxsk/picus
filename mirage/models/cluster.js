import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  nodes: hasMany('node'),
  resources: hasMany('resource'),
  properties: hasMany('property'),
});
