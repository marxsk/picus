import Ember from 'ember';
const { RSVP } = Ember;

export default Ember.Route.extend({
  selectedAgent : undefined,
  modelForm: {},
  metadata: {},

  beforeModel() {
    return new RSVP.Promise((resolve, reject) => {
      this.store.getAvailableAgents('fence').then(
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
    if (! (this.get('selectedAgent'))) {
      const agent = this.get('availables.undefinedProvider')[0];
      this.set('modelForm.fenceAgent', agent);
      this.set('selectedAgent', agent);
    }

    return Ember.RSVP.hash({
      availableAgents: this.get('availables'),
      formData: this.get('modelForm'),
      metadata: this.store.getAgentMetadata('fence', 'stonith:' + this.get('selectedAgent')),
    });
  },

  actions: {
    changeSelectedAgent: function(form, fieldName, selectedItem) {
      this.set('modelForm', form);
      this.set('selectedAgent', selectedItem);
      this.refresh();
    },
    onSubmitAction: function(selectedAgent, form) {
      this.set('modelForm', form);

      this.store.pushUpdateAgentProperties('fence', {
        agentType: this.get('selectedAgent').replace(/^(stonith::)/,""),
        properties: form.get('changes'),
      }, 'create');

      this.transitionTo('cluster.fences.show', '');
    }
  }
});
