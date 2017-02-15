import Ember from 'ember';
const { RSVP } = Ember;

export default Ember.Route.extend({
  selectedAgent : undefined,
  modelForm: {},
  metadata: {},

  beforeModel() {
    const _this = this;

    return new RSVP.Promise(function(resolve, reject) {
      _this.store.getAvailableAgents('fence').then(
        function(response) {
          _this.set('availables', response);
          resolve(response);
        }, function(xhr) {
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
      metadata: this.store.getAgentMetadata('fence', this.get('selectedAgent')),
      selectedAgent: this.get('selectedAgent'),
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

      this.store.pushNewAgent('fence', {
        name: form.get('fenceName'),
        agentType: this.get('selectedAgent'),
        properties: form.get('changes'),
      }, ['fenceName']);

      this.transitionTo('fences.listing');
    }
  }
});
