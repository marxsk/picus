import Ember from 'ember';
const { RSVP } = Ember;

export default Ember.Route.extend({
  modelForm: {},
  metadata: undefined,
  selectedResources: Ember.A(),

  beforeModel(transition) {
    const fenceId = transition.state.params['fences.show'].fence_id;

    if (fenceId == '') {
      return this.store.reloadData();
    }

    return new RSVP.Promise((resolve, reject) => {
      this.store.reloadData().then((response) => {
        const fence = this.store.peekRecord('fence', fenceId);
        if (fence == null) {
          resolve();
          return;
        }
        this.store.getAgentMetadata('fence', 'stonith:' + fence.get('agentType')).then((resp) => {
          this.set('metadata', resp);
          resolve();
        }, (xh) => {
          // @todo: proper error handling
        });
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
    // this should be in serialization (?) but we need agent metadata to do it

    // -> in metadata
    this.get('metadata.parameters').forEach((o) => {
      if (o.type === 'boolean') {
        if (['1', 'on', true, 'yes'].includes(o.default)) {
          o.default = 'true';
        };
      }
    });

    // -> in the properties
    fence.get('properties').forEach((item) => {
      this.get('metadata.parameters').forEach((o) => {
        if (o.name === item.get('name')) {
          if (['1', 'on', true, 'yes'].includes(item.get('value'))) {
            item.set('value', 'true');
          };
        }
      });

      this.set('modelForm.' + item.get('name'), item.get('value'));
    });

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

      this.transitionTo('fences.show', '');
    },
    onCheck: function(x) {
      if (this.get('selectedResources').includes(x)) {
        this.get('selectedResources').removeObject(x);
      } else {
        this.get('selectedResources').addObject(x);
      }
    },
    changeSelectedAgent() {},
    removeSelectedResources: function() {
        let names = [];
        this.get('selectedResources').forEach((x) => {
          names.push(x.get('name'));
        });
        this.store.removeFences(names);
        this.transitionTo('fences.show', '');
    },
    removeResource: function(resourceName) {
      this.store.removeFences([resourceName]);
      this.transitionTo('fences.show', '');
    },

  }
});
