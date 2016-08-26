import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  nodeAttributes: hasMany('attribute'),
  nodeUtilizationAttributes: hasMany('attribute'),
});
