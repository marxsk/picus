import Ember from 'ember';
import TabRoute from 'picus/routes/tab-route';

export default TabRoute.extend({
  modelForm: {},
  formMapping: {},
  fence: undefined,

  init(...args) {
    this._super(...args);
  },

  async model(params) {
    const fence = this.store.peekRecordQueryName('fence', params.fence_name);
    this.set('fence', fence);

    if (fence === null) {
      return Ember.RSVP.hash({
        listing: params.fence_id.length === 0,
        updatingCluster: this.store.peekAll('cluster'),
        params,
      });
    }

    const metadata = await this.store.getAgentMetadata(
      'fence',
      `stonith:${fence.get('agentType')}`,
    );

    if (fence.get('properties')) {
      fence.get('properties').forEach((item) => {
        this.set(`modelForm.${item.get('name')}`, item.get('value'));
      });
    }

    this.set('formMapping', Ember.Object.create());
    // @todo: this should be derived from the pcmk_host_map/pcmk_host_list
    this.set('formMapping.mappingScheme', 'manual');

    const pcmkHostMap = fence.get('properties').filterBy('name', 'pcmk_host_map');

    // initialize fence mapping so we can edit it in the component
    const nodes = this.store.peekAll('cluster').get('firstObject.nodes');
    nodes.forEach((n) => {
      this.set(`formMapping.fence_${n.get('name')}`, Ember.Object.create({
        name: n.get('name'),
      }));
    });

    if (pcmkHostMap.length > 0) {
      // @note: computed property?
      pcmkHostMap[0]
        .get('value')
        .split(';')
        .forEach((entry) => {
          const [node, plugs] = entry.split(':');
          this.set(`formMapping.fence_${node}.plugs`, plugs);
          this.set(`formMapping.fence_${node}.checked`, true);
        });
    }

    return Ember.RSVP.hash({
      params,
      metadata,
      formData: this.get('modelForm'),
      formMapping: this.get('formMapping'),
      updatingCluster: this.store.peekAll('cluster'),
      selectedFence: fence,
      fences: this.store.peekAll('fence'),
    });
  },

  actions: {
    onSubmitAction(form) {
      const fence = this.get('fence');
      form.get('changes').forEach((obj) => {
        if (typeof obj.value === 'object') {
          // Only primitive values can be serialized.
          // EmptyObject is a result of value from select-field with (array)
          // which was not changed, so it should be ignored.
          return;
        }

        const existingProps = this.get('store')
          .peekAll('fence-property')
          .filterBy('name', obj.key)
          .filterBy('fence.name', fence.get('name'));

        if (existingProps.length === 0) {
          fence.get('properties').addObject(this.get('store').createRecord('fence-property', {
            fence,
            name: obj.key,
            value: obj.value,
          }));
        } else {
          existingProps[0].set('value', obj.value);
        }
      });

      this.transitionTo('cluster.fences.index');
      this.set('modelForm', {});
      return this.get('notifications').notificationSaveRecord(fence, 'UPDATE_FENCE');
    },

    changeSelectedAgent() {},
    removeResource(resource) {
      resource.deleteRecord();
      this.transitionTo('cluster.fences.index');
      return this.get('notifications').notificationSaveRecord(resource, 'REMOVE_RESOURCE');
    },
    updateMapping(form) {
      const fence = this.get('fence');
      const nodesOnly = Object.keys(form).filter(x => x !== 'mappingScheme');

      const newPcmkHostMapList = [];
      nodesOnly.forEach((nodeIndex) => {
        const node = form.get(nodeIndex);

        if (node.get('checked')) {
          const plugs = node.getWithDefault('plugs', '').trim();
          newPcmkHostMapList.push(`${node.get('name')}:${plugs}`);
        }
      });
      const newPcmkHostMapString = newPcmkHostMapList.join(';');

      // @todo: duplicate code with submitAction
      const existingProps = this.get('store')
        .peekAll('fence-property')
        .filterBy('name', 'pcmk_host_map')
        .filterBy('fence.name', fence.get('name'));

      if (existingProps.length === 0) {
        fence.get('properties').addObject(this.get('store').createRecord('fence-property', {
          fence,
          name: 'pcmk_host_map',
          value: newPcmkHostMapString,
        }));
      } else {
        existingProps[0].set('value', newPcmkHostMapString);
      }

      this.set('formMapping', Ember.Object.create());
      this.transitionTo('cluster.fences.index');
      return this.get('notifications').notificationSaveRecord(fence, 'UPDATE_FENCE');
    },
  },
});
