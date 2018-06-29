import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    this.set(
      'authorizedNodesForm',
      this.getWithDefault('authorizedNodesForm', Ember.Object.create()),
    );
  },

  model() {
    return Ember.RSVP.hash({
      authorizedNodesForm: this.get('authorizedNodesForm'),
    });
  },

  actions: {
    authorizeNode(nodeInfo) {
      // @todo: do real implementation of auth (service + mock)
      // return Ember.RSVP.resolve('Auth works');
      // return Ember.RSVP.reject('Unable to auth');
      return this.store.getAuthorizeNode(nodeInfo);
    },
    emptyNode(node) {
      return !node || node.getWithDefault('nodename', '') === '';
    },
    xyz(record, value) {
      record.set('nodename', value.get('nodename'));
    },
    fff(x, y, z) {
      console.log(x);
      console.log(y);
      console.log(z);
    },
  },
});
