import Ember from 'ember';
import TabRoute from 'picus/routes/tab-route';
import { validatePresence, validateNumber } from 'ember-changeset-validations/validators';

export default TabRoute.extend({
  modelForm: {},
  node: undefined,
  notifications: Ember.inject.service('notifications'),

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

  model(params) {
    const node = this.store.peekRecordQueryName('node', params.node_name);
    this.set('node', node);

    const formValidators = {
      addNodeAttribute: {
        key: validatePresence(true),
        value: validatePresence(true),
      },
      addNodeUtilizationAttribute: {
        name: validatePresence(true),
        value: validateNumber({ integer: true, allowBlank: false }),
      },
    };

    return Ember.RSVP.hash({
      params,
      validations: formValidators,
      updatingCluster: this.store.peekAll('cluster'),
      selectedNode: node,
    });
  },

  actions: {
    pageRefresh() {
      this.refresh();
    },

    removeNode() {},

    onClick(component) {
      this.set('selectedNode', component);
    },
    onCheck() {},

    deleteNodeAttribute(actionName, attribute) {
      attribute.deleteRecord();
      this.get('notifications').notificationSaveRecord(attribute, actionName);
    },
    // @bug
    deleteMultipleAttributes(attributes) {
      attributes.forEach((item) => {
        item.deleteRecord();
        item.save();
      });
    },
    appendNodeUtilizationAttribute(form) {
      const attribute = this.get('store').createRecord('node-utilization-attribute', {
        node: this.get('node'),
        name: form.get('name'),
        value: form.get('value'),
      });
      return this.get('notifications').notificationSaveRecord(
        attribute,
        'ADD_NODE_UTILIZATION_ATTRIBUTE',
      );
    },
    appendNodeAttribute(form) {
      const attribute = this.get('store').createRecord('node-attribute', {
        node: this.get('node'),
        key: form.get('key'),
        value: form.get('value'),
      });
      return this.get('notifications').notificationSaveRecord(attribute, 'ADD_NODE_ATTRIBUTE');
    },

    nodeAction(action, component) {
      switch (action) {
        case 'start':
        case 'stop':
        case 'reboot':
          break;
        default:
          break;
      }
    },
  },
});
