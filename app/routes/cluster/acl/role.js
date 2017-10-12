import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller, model) {
    this._super(controller, model);
    // hide sidebar menu
    this.controllerFor('application').set('hideMainMenu', true);
  },

  model() {
    console.log('aaa');
    return Ember.RSVP.hash({
      updatingCluster: this.store.peekAll('cluster'),
    });
  }
});
