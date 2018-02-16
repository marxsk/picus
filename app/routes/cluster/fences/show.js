import Ember from 'ember';
import TabRoute from 'picus/routes/tab-route';

export default TabRoute.extend({
  modelForm: {},
  fence: undefined,
  notifications: Ember.inject.service('notifications'),
  messages: Ember.inject.service('messages'),

  queryParams: {
    filterString: {
      as: 's',
      replace: true,
    },
    showInternalNames: {
      as: 'internal',
      replace: true,
    },
  },

  setupController(controller, model) {
    this._super(controller, model);
    // hide sidebar menu
    this.controllerFor('application').set('hideMainMenu', true);
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

    return Ember.RSVP.hash({
      params,
      metadata,
      formData: this.get('modelForm'),
      updatingCluster: this.store.peekAll('cluster'),
      selectedFence: fence,
      fences: this.store.peekAll('fence'),
    });
  },

  actions: {
    pageRefresh() {
      this.refresh();
    },

    onSubmitAction(form) {
      const fence = this.get('fence');
      form.get('changes').forEach((obj) => {
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
  },
});
