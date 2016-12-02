import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    let modelForm = {};

    return Ember.RSVP.hash({
      availableAgents: this.store.getAvailableFenceAgents(),
      formData: modelForm,
    });
  }
});
