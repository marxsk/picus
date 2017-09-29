import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  resources: hasMany('resource', {inverse: 'unused99'}),
});
