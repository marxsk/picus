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
      cluster: this.store.peekAll('cluster'),
      selectedResources: this.get('selectedResources'),
    });
  },

  actions: {
    onCheck: function(x) {
      if (this.get('selectedResources').includes(x)) {
        this.get('selectedResources').removeObject(x);
      } else {
        this.get('selectedResources').pushObject(x);
      }
    },

    removeSelectedResources: function() {
      this.store.removeAgents(
        this.get('selectedResources').map((x) => {return x.get('name');}),
        'resource'
      );
      this.get('selectedResources').clear();
      this.transitionTo('cluster.resources.show', '');
    },

    linkTo: function(path) {
      this.transitionTo(path);
    }
  }
});
