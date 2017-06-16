import Ember from 'ember';
const { RSVP } = Ember;

export default Ember.Route.extend({
  modelForm: {},
  metadata: undefined,
  selectedResources: Ember.A(),

  beforeModel(transition) {
    const fenceId = transition.state.params['cluster.fences.show'].fence_id;

    const fence = this.store.peekRecord('fence', fenceId);
    if (fence == null) {
      return;
    }

    return new RSVP.Promise((resolve, reject) => {
        this.store.getAgentMetadata('fence', 'stonith:' + fence.get('agentType')).then((resp) => {
          this.set('metadata', resp);
          resolve();
        }, (xhr) => {
          // @todo: proper error handling
        });
    });
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

    // normalize (1|on|true|yes) => 'true' for boolean options
    // @todo: this should be in serialization (?) but we need agent metadata to do it
    this.get('metadata.parameters').forEach((o) => {
      if (o.type === 'boolean') {
        if (['1', 'on', true, 'yes'].includes(o.default)) {
          o.default = 'true';
        }
      }
    });

    fence.get('properties').forEach((item) => {
      this.get('metadata.parameters').forEach((o) => {
        if (o.name === item.get('name')) {
          if (['1', 'on', true, 'yes'].includes(item.get('value'))) {
            item.set('value', 'true');
          }
        }
      });

      this.set('modelForm.' + item.get('name'), item.get('value'));
    });

    // @todo: selectedFence return LiveArray and very likely this is not required anymore
    return Ember.RSVP.hash({
      params: params,
      metadata: this.get('metadata'),
      formData: this.get('modelForm'),
      cluster: this.store.peekAll('cluster'),
      selectedFence: this.store.filter('fence', (item) => { return item.id === params.fence_id; }),
    });
  },

  actions: {
    onSubmitAction: function(fence, form) {
      form.get('changes').forEach((item) => {
        this.get('metadata.parameters').forEach((o) => {
          if (o.name === item.key) {
            if ((o.type === "boolean") && (item.value === 'default')) {
              item.value = '';
            }
          }
        });
      });

      this.store.pushUpdateAgentProperties('fence', {
        name: fence.get('name'),
        agentType: fence.get('agentType'),
        properties: form.get('changes'),
      }, 'update');

      this.transitionTo('cluster.fences.show', '');
    },
    onCheck: function(item) {
      if (this.get('selectedResources').includes(item)) {
        this.get('selectedResources').removeObject(item);
      } else {
        this.get('selectedResources').addObject(item);
      }
    },
    changeSelectedAgent() {},
    removeSelectedResources: function() {
        this.store.removeAgents(
          this.get('selectedResources').map((x) => {return x.get('name');}),
          'fence'
        );
        this.transitionTo('cluster.fences.show', '');
    },
    removeResource: function(resourceName) {
      this.store.removeAgents([resourceName], 'fence');
      this.transitionTo('cluster.fences.show', '');
    }
  }
});
