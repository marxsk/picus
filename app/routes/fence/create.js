import Ember from 'ember';

export default Ember.Route.extend({
  selectedAgent : 'fence_apc',
  modelForm: {},
  metadata: {},

  model() {
    this.set('metadata', this.store.getAgentMetadata('fence', this.get('selectedAgent')));

    return Ember.RSVP.hash({
      availableAgents: this.store.getAvailableAgents('fence'),
      formData: this.get('modelForm'),
      // @note: this should be computed property based on agent selected in combobox
      metadata: this.get('metadata'),
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

      this.transitionTo('fence.listing');
    }
  }
});
