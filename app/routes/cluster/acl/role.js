import Ember from 'ember';
import TabRoute from 'picus/routes/tab-route';
import {
  validatePresence,
} from 'ember-changeset-validations/validators';

export default TabRoute.extend({
  notifications: Ember.inject.service('notifications'),

  aclRole: undefined,

  setupController(controller, model) {
    this._super(controller, model);
    // hide sidebar menu
    this.controllerFor('application').set('hideMainMenu', true);
  },

  model(params) {
    const aclRole = this.store.peekRecordQueryName('aclRole', params.role_name);

    this.set('aclRole', aclRole);

    const validations = {
      addPermission: {
        query: validatePresence(true),
      }
    }

    return Ember.RSVP.hash({
      updatingCluster: this.store.peekAll('cluster'),
      aclRole,
      params,
      validations,
    });
  },

  actions: {
    addPermission: function(form) {
      const permission = this.get('store').createRecord('acl-permission', {
        role: this.get('aclRole'),
        operation: form.get('operation'),
        xpath: form.get('xpath'),
        query: form.get('query'),
      });
      return this.get('notifications').notificationSaveRecord(permission, 'ADD_ACL_PERMINISSION');
    },
    deletePermission: function(actionName, permission) {
      permission.deleteRecord();
      this.get('notifications').notificationSaveRecord(permission, actionName);
    },
  }
});
