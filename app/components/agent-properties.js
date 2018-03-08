import Ember from 'ember';
import categorizeProperties from 'picus/utils/categorize-properties';

export default Ember.Component.extend({
  didReceiveAttrs(...args) {
    this._super(...args);

    // In order to simplify wizards, we cannot replace metadata but only the attribute of it
    // so it works without model reloading
    let metadataPath = 'metadata.response.parameters';
    if (!this.get(metadataPath)) {
      metadataPath = 'metadata.parameters';
    }

    const { parameters, validations } = categorizeProperties(this.get(metadataPath));

    if (this.get(metadataPath)) {
      const elementResourceName = this.get(metadataPath).find(x => x.name === 'resourceName');
      if (elementResourceName === undefined) {
        // Validating resouceName that is outside of the form makes 'submit' unavailable
        // as we cannot fulfill this validation.
        delete validations.resourceName;
      }
    }

    this.set('parameters', parameters);
    this.set('validations', validations);
  },
});
