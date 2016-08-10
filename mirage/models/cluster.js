import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  nodes: hasMany(),
  resources: hasMany(),
});
