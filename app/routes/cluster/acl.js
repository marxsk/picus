import Ember from 'ember';
import ResourceValidations from '../../validators/resource-validations';
import {
  validatePresence,
  validateLength,
  validateNumber,
} from 'ember-changeset-validations/validators';

export default Ember.Route.extend({
  queryParams: {
    activeTab: {
      as: 'tab',
      replace: true
    }
  },

  model() {
    let nameValidation = {
      name: [ validatePresence({presence: true}) ]
    };
    let xpathValidation = {
      xpath: [ validatePresence({presence: true}) ]
    }

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
  }
});
