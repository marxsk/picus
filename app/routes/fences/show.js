import Ember from 'ember';

export default Ember.Route.extend({
  modelForm: {},

  beforeModel() {
    return this.store.reloadData();
  },

  model(params) {
    const fence = this.store.peekRecord('fence', params.fence_id);

    if (fence === null) {
      return Ember.RSVP.hash({
        listing: (params.fence_id.length === 0) ? true : false,
        cluster: this.store.peekAll('cluster'),
        params: params,
      });
    }

    fence.get('properties').forEach((item) => {
      this.set('modelForm.' + item.get('name'), item.get('value'));
    });

    return Ember.RSVP.hash({
      params: params,
      metadata: this.store.getAgentMetadata('fence', 'stonith:' + this.store.peekRecord('fence', params.fence_id).get('agentType')),
      formData: this.get('modelForm'),
      cluster: this.store.peekAll('cluster'),
      selectedFence: this.store.filter('fence', (item) => { return item.id === params.fence_id; }),
    });
  },

  actions: {
    onSubmitAction: function(id, form) {
      this.store.pushUpdateAgentProperties('fence', {
        id,
        properties: form.get('changes'),
      });

      this.transitionTo('fences.show', '');
    },
    onCheck: function() {

    },
    changeSelectedAgent() {},
  }
});
