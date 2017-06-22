import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    // @todo: replace peekAll() - should we have static or dynamic content inside
    return Ember.RSVP.hash({
      resources: this.store.peekAll('resource'),
    });
  },
});
