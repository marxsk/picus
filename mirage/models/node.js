import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  nodeAttributes: hasMany('attribute', {inverse: 'unused1'}),
  nodeUtilizationAttributes: hasMany('attribute', {inverse: 'unused2'}),
});
