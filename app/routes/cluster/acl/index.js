import Ember from 'ember';
import {
  validatePresence,
} from 'ember-changeset-validations/validators';
import TabRoute from '../../tab-route';

export default TabRoute.extend({
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
    delete: (attribute) => {
      attribute.deleteRecord();
      attribute.save();
    },
    deleteMultiple: (attributes) => {
      attributes.forEach((item) => {
        item.deleteRecord();
        item.save();
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
      // @todo: add notification
      aclRole.save();
    },
  }
});
