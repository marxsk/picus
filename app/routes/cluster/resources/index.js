import Ember from 'ember';

export default Ember.Route.extend({
  notifications: Ember.inject.service('notifications'),
  selectedResources: Ember.A(),

  beforeModel() {
    this.get('selectedResources').clear();
  },

  // @todo: replace with service
  setupController(controller, model) {
    this._super(controller, model);
    // hide sidebar menu
    this.controllerFor('application').set('hideMainMenu', false);
  },

  model() {
    return Ember.RSVP.hash({
      updatingCluster: this.store.peekAll('cluster'),
      selectedResources: this.get('selectedResources'),
    });
  },

  actions: {
    onCheck(x) {
      if (this.get('selectedResources').includes(x)) {
        this.get('selectedResources').removeObject(x);
      } else {
        this.get('selectedResources').pushObject(x);
      }
    },

    removeSelectedResources() {
      this.get('notifications').notificationSaveRecord(
        this.get('selectedResources'),
        'REMOVE_RESOURCES',
        this.store.removeAgents(this.get('selectedResources'), 'resource'),
      );

      this.get('selectedResources').clear();
    },

    linkTo(path) {
      this.transitionTo(path);
    },
  },
});
