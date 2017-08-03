import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  resources: hasMany('resource'),
  properties: hasMany('resourceProperty'),
  metaAttributes: hasMany('attribute', {inverse: 'unused3'}),
  utilizationAttributes: hasMany('utilizationAttribute', {invese: 'unused'}),
  locationPreferences: hasMany('locationPreference', {inverse: 'unused'}),
  orderingPreferences: hasMany('orderingPreference', {inverse: 'unused'}),
  colocationPreferences: hasMany('colocationPreference', {inverse: 'unused'}),
  ticketPreferences: hasMany('ticketPreference', {inverse: 'unused'}),
});
