import Ember from 'ember';
import categorizeProperties from '../../../utils/categorize-properties';

const { RSVP } = Ember;

export default Ember.Route.extend({
  notifications: Ember.inject.service('notifications'),

  selectedAgent: undefined,
  modelForm: {},
  metadata: {},
  availables: {},

  beforeModel() {
    return new RSVP.Promise((resolve, reject) => {
      this.store.getAvailableAgents('fence').then(
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
    if (!this.get('selectedAgent')) {
      const agent = this.get('availables.undefinedProvider')[0];
      this.set('modelForm.fenceAgent', agent);
      this.set('selectedAgent', agent);
    }

    const metadata = await this.store.getAgentMetadata(
      'fence',
      `stonith:${this.get('selectedAgent')}`,
    );
    metadata.parameters.forEach((i) => {
      this.set(`modelForm.${i.name}`, '');
    });
    const { parameters, validations } = categorizeProperties(metadata.parameters);

    return Ember.RSVP.hash({
      availableAgents: this.get('availables'),
      formData: this.get('modelForm'),
      metadata,
      selectedAgent: this.get('selectedAgent'),
      selectedProvider: this.get('selectedProvider'),
      parameters,
      ResourceValidations: validations,
    });
  },

  actions: {
    changeSelectedAgent(form, fieldName, selectedItem) {
      this.set('modelForm', form);
      this.set('selectedAgent', selectedItem);
      this.refresh();
    },
    onSubmitAction(form) {
      this.set('modelForm', form);

      form.validate().then(() => {
        if (form.get('isValid')) {
          const cluster = this.store.peekAll('cluster').objectAt(0);

          const resource = this.get('store').createRecord('fence', {
            name: form.get('resourceName'),
            agentType: this.get('selectedAgent'),
          });

          form.get('changes').forEach((obj) => {
            if (['resourceName'].includes(obj.key)) {
              return;
            }
            resource.get('properties').addObject(this.get('store').createRecord('fence-property', {
              resource,
              name: obj.key,
              value: obj.value,
            }));
          });

          cluster.get('fences').addObject(resource);

          this.set('modelForm', {});
          this.transitionTo('cluster.fences.index');

          return this.get('notifications').notificationSaveRecord(resource, 'ADD_FENCE');
        }

        // alert('Fix it - @todo: Button stays on Processing');
        return RSVP.reject('Form is not valid');
      });
    },
  },
});
