import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  resources: hasMany('resource'),
  properties: hasMany('resourceProperty'),
  metaAttributes: hasMany('attribute', {inverse: 'unused3'}),
});
