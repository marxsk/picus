import Ember from 'ember';
import {
  validatePresence,
} from 'ember-changeset-validations/validators';
import TabRoute from '../../tab-route';

export default TabRoute.extend({
  notifications: Ember.inject.service('notifications'),

  model() {
    let nameValidation = {
      name: [ validatePresence({presence: true}) ]
    };
    let xpathValidation = {
      xpath: [ validatePresence({presence: true}) ]
    };

    return Ember.RSVP.hash({
      updatingCluster: this.store.peekAll('cluster'),
      nameValidation,
      xpathValidation,
    });
  },

  actions: {
    delete: function(actionName, record) {
      record.deleteRecord();
      this.get('notifications').notificationSaveRecord(record, actionName);
    },
    deleteMultiple: function(actionName, records) {
      records.forEach((record) => {
        record.deleteRecord();
        this.get('notifications').notificationSaveRecord(record, actionName);
      });
    },
    appendUser: function(attributes) { this.store.pushAppendUser(attributes); },
    appendGroup: function(attributes) { this.store.pushAppendGroup(attributes); },
    appendRole: function(attributes) { this.store.pushAppendRole(attributes); },
    appendPermission: function(roleName, attributes) {
      if (attributes.operation === undefined) {
        attributes.operation = "deny";
      }
      this.store.pushAppendPermission(roleName, attributes);
    },
    addRole: function(attributes) {
      const cluster = this.store.peekAll('cluster').objectAt(0);
      const aclRole = this.get('store').createRecord('acl-role', {
        cluster: cluster,
        name: attributes.get('name'),
        description: attributes.get('description'),
      })
      this.get('notifications').notificationSaveRecord(aclRole, 'ADD_ACL_ROLE');
    },
  }
});
