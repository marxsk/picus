import Ember from 'ember';

export default Ember.Route.extend({
  notifications: Ember.inject.service('notifications'),
  selectedNodes: Ember.A(),

  // @todo: replace with service
  setupController(controller, model) {
    this._super(controller, model);
    // hide sidebar menu
    this.controllerFor('application').set('hideMainMenu', false);
  },

  model() {
    return Ember.RSVP.hash({
      updatingCluster: this.store.peekAll('cluster'),
      selectedNodes: this.get('selectedNodes'),
    });
  },

  actions: {
    onCheck(x) {
      if (this.get('selectedNodes').includes(x)) {
        this.get('selectedNodes').removeObject(x);
      } else {
        this.get('selectedNodes').pushObject(x);
      }
    },

    removeSelectedNodes() {
      this.get('notifications').notificationSaveRecord(
        this.get('selectedNodes'),
        'REMOVE_NODE',
        undefined,
      );

      this.get('selectedNodes').clear();
    },
  },
});
