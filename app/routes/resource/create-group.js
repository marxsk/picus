import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    return this.store.reloadData();
  },

  model(params) {
    return Ember.RSVP.hash({
      resources: this.store.peekAll('resource'),
    });
  },
});
