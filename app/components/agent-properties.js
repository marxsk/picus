import Ember from 'ember';
import categorizeProperties from 'picus/utils/categorize-properties';

export default Ember.Component.extend({
  didReceiveAttrs() {
    this._super(...arguments);

    const { parameters, validations } = categorizeProperties(this.get('metadata.parameters'));

    this.set('parameters', parameters);
    this.set('validations', validations);
  },
});
