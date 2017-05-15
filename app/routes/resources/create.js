import Ember from 'ember';
const { RSVP } = Ember;

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

  model() {
    if (! (this.get('selectedProvider'))) {
      const provider = Object.keys(this.get('availables'))[6];
      const agent = this.get('availables.' + provider)[0];
      this.set('selectedProvider', provider);
      this.set('modelForm.resourceProvider', provider);

      this.set('modelForm.resourceAgent', agent);
      this.set('selectedAgent', agent);
    }

    return Ember.RSVP.hash({
      availableAgents: this.get('availables'),
      formData: this.get('modelForm'),
      metadata: this.store.getAgentMetadata('resource', this.get('selectedProvider') + ':' + this.get('selectedAgent')),
      selectedAgent: this.get('selectedAgent'),
      selectedProvider: this.get('selectedProvider'),
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

      this.store.pushUpdateAgentProperties('resource', {
        name: form.get('resourceName'),
        agentProvider: this.get('selectedProvider'),
        agentType: this.get('selectedAgent'),
        clone: form.get('clone'),
        masterslave: form.get('masterslave'),
        properties: form.get('changes'),
      }, 'create');

      this.transitionTo('resources.index');
    }
  }
});
