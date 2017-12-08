import Ember from 'ember';

export default Ember.Route.extend({
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
      this.store.removeAgents(this.get('selectedResources').map(x => x.get('name')), 'resource');
      this.get('selectedResources').clear();
      this.transitionTo('cluster.resources.show', '');
    },

    linkTo(path) {
      this.transitionTo(path);
    },
  },
});
