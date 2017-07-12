import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    activeTab: {
      as: 'tab',
      replace: true
    }
  },

  model() {
    return Ember.RSVP.hash({
      updatingCluster: this.store.peekAll('cluster'),
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
    appendUser: function(attributes, attr) { this.store.pushAppendUser(attr); },
    appendGroup: function(attributes, attr) { this.store.pushAppendGroup(attr); },
    appendRole: function(attributes, attr) { this.store.pushAppendRole(attr); },
    appendPermission: function(roleName, attributes, attr) {
      if (attr.operation === undefined) {
        attr.operation = "deny";
      }
      this.store.pushAppendPermission(roleName, attr);
    },
  }
});
