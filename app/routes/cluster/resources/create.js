import Ember from 'ember';
import ResourceValidations from 'picus/validators/resource-validations';

const { RSVP } = Ember;

export default Ember.Route.extend({
  notifications: Ember.inject.service('notifications'),

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
        },
        (xhr) => {
          reject(xhr);
        },
      );
    });
  },

  async model() {
    if (!this.get('selectedProvider') || Object.keys(this.get('modelForm')).length === 0) {
      const provider = Object.keys(this.get('availables'))[1];
      const agent = this.get(`availables.${provider}`)[0];
      this.set('selectedProvider', provider);
      this.set('selectedAgent', agent);

      this.set('modelForm.resourceProvider', provider);
      this.set('modelForm.resourceAgent', agent);
    }

    const metadata = await this.store.getAgentMetadata(
      'resource',
      `${this.get('selectedProvider')}:${this.get('selectedAgent')}`,
    );
    metadata.parameters.forEach((i) => {
      this.set(`modelForm.${i.name}`, '');
    });

    return Ember.RSVP.hash({
      availableAgents: this.get('availables'),
      formData: this.get('modelForm'),
      metadata,
      selectedAgent: this.get('selectedAgent'),
      selectedProvider: this.get('selectedProvider'),
      resourceValidation: ResourceValidations,
    });
  },

  actions: {
    changeSelectedAgent(form, fieldName, selectedItem) {
      this.set('modelForm', form);
      this.set('selectedAgent', selectedItem);
      this.refresh();
    },
    changeSelectedProvider(form, fieldName, selectedItem) {
      this.set('modelForm', form);
      this.set('selectedProvider', selectedItem);
      this.set('selectedAgent', this.get(`availables.${this.get('selectedProvider')}`)[0]);
      this.set('modelForm.resourceAgent', this.get('selectedAgent'));

      // @todo: add loading screen
      // @todo: improve reaction to change provider
      // @todo: add test
      // didReceiveAttr?

      this.refresh();
    },
    onSubmitAction(form) {
      this.set('modelForm', form);

      form.validate().then(() => {
        if (form.get('isValid')) {
          const cluster = this.store.peekAll('cluster').objectAt(0);

          const resource = this.get('store').createRecord('resource', {
            name: form.get('resourceName'),
            agentProvider: this.get('selectedProvider'),
            agentType: this.get('selectedAgent'),
            clone: form.get('clone'),
            masterslave: form.get('masterslave'),
          });

          form.get('changes').forEach((obj) => {
            if (['resourceName', 'clone', 'masterslave'].includes(obj.key)) {
              return;
            }
            resource.get('properties').addObject(this.get('store').createRecord('resource-property', {
              resource,
              name: obj.key,
              value: obj.value,
            }));
          });

          cluster.get('resources').addObject(resource);

          this.set('modelForm', {});
          this.transitionTo('cluster.resources.index');

          return this.get('notifications').notificationSaveRecord(resource, 'ADD_RESOURCE');
        }

        // alert('Fix it - @todo: Button stays on Processing');
        return RSVP.reject('Form is not valid');
      });
    },
  },
});
