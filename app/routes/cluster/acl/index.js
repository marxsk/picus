import Ember from 'ember';
import { validatePresence } from 'ember-changeset-validations/validators';
import TabRoute from 'picus/routes/tab-route';

export default TabRoute.extend({
  notifications: Ember.inject.service('notifications'),

  model() {
    const nameValidation = {
      name: [validatePresence({ presence: true })],
    };
    const xpathValidation = {
      xpath: [validatePresence({ presence: true })],
    };

    return Ember.RSVP.hash({
      updatingCluster: this.store.peekAll('cluster'),
      nameValidation,
      xpathValidation,
    });
  },

  actions: {
    delete(actionName, record) {
      record.deleteRecord();
      return this.get('notifications').notificationSaveRecord(record, actionName);
    },
    deleteMultiple(actionName, records) {
      records.forEach((record) => {
        record.deleteRecord();
        return this.get('notifications').notificationSaveRecord(record, actionName);
      });
    },
    addRole(attributes) {
      const cluster = this.store.peekAll('cluster').objectAt(0);
      const aclRole = this.get('store').createRecord('acl-role', {
        cluster,
        name: attributes.get('name'),
        description: attributes.getWithDefault('description', ''),
      });
      return this.get('notifications').notificationSaveRecord(aclRole, 'ADD_ACL_ROLE');
    },
  },
});
