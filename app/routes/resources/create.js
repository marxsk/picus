import Ember from 'ember';
import ResourceValidations from '../../validators/resource-validations';
const { RSVP } = Ember;
import {
  validatePresence,
  validateLength,
  validateNumber,
} from 'ember-changeset-validations/validators';

export default Ember.Route.extend({
  selectedAgent: undefined,
  selectedProvider: undefined,
  modelForm: {},
  metadata: {},
  availables: {},

  beforeModel() {
    return new RSVP.Promise((resolve, reject) => {
      this.store.getAvailableAgents('resource').then(
        (response) => {
          this.set('availables', response);
          resolve(response);
        }, (xhr) => {
          reject(xhr);
        }
      );
    });
  },

  async model() {
    if (! (this.get('selectedProvider'))) {
      const provider = Object.keys(this.get('availables'))[6];
      const agent = this.get('availables.' + provider)[0];
      this.set('selectedProvider', provider);
      this.set('modelForm.resourceProvider', provider);

      this.set('modelForm.resourceAgent', agent);
      this.set('selectedAgent', agent);
      this.set('modelForm.resourceName', '');
    }

    let validations = {...ResourceValidations}
    const metadata = await this.store.getAgentMetadata('resource', this.get('selectedProvider') + ':' + this.get('selectedAgent'));
    metadata.parameters.forEach((i) => {
      validations[i.name] = [];
      if (i.required) {
        validations[i.name].push(validatePresence({presence: true}));
      }
      if (i.type === 'integer') {
        validations[i.name].push(validateNumber({integer: true, allowBlank: true}));
      }

      this.set(`modelForm.${i.name}`, '');
    })

    return Ember.RSVP.hash({
      availableAgents: this.get('availables'),
      formData: this.get('modelForm'),
      metadata: metadata,
      selectedAgent: this.get('selectedAgent'),
      selectedProvider: this.get('selectedProvider'),
      ResourceValidations: validations,
    });
  },

  actions: {
    changeSelectedAgent: function(form, fieldName, selectedItem) {
      this.set('modelForm', form);
      this.set('selectedAgent', selectedItem);
      this.refresh();
    },
    changeSelectedProvider: function(form, fieldName, selectedItem) {
      this.set('modelForm', form);
      this.set('selectedProvider', selectedItem);
      this.refresh();
    },
    onSubmitAction: function(selectedAgent, form) {
      this.set('modelForm', form);

      form.validate().then(() => {
        if (form.get('isValid')) {
          this.store.pushUpdateAgentProperties('resource', {
            name: form.get('resourceName'),
            agentProvider: this.get('selectedProvider'),
            agentType: this.get('selectedAgent'),
            clone: form.get('clone'),
            masterslave: form.get('masterslave'),
            properties: form.get('changes'),
          }, 'create');

          this.transitionTo('resources.index');
        } else {
          alert('Fix it - @todo: Button stays on Processing');
        }
      });

      return;
    }
  }
});
