import Ember from 'ember';
import categorizeProperties from 'picus/utils/categorize-properties';
import lookupValidator from 'ember-changeset-validations';
import Changeset from 'ember-changeset';

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
    this.set('parameters', parameters);
    this.set('_validations', Ember.copy(validations));

    if (this.get('appendValidations')) {
      Object.keys(this.get('appendValidations')).forEach((field) => {
        const validation = this.get(`appendValidations.${field}`);
        this.set(`_validations.${field}`, validation);
      });
    }

    // We should not create a changeset inside the template because it won't
    // survive the changes after toggle of internal names or filter strin update
    if (!this.get('changeset')) {
      this.set(
        'changeset',
        new Changeset(
          this.get('formData'),
          lookupValidator(this.get('_validations')),
          this.get('_validations'),
        ),
      );
      this.get('changeset').validate();
    }
  },
});
