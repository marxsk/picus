import Ember from 'ember';
import { validatePresence } from 'ember-changeset-validations/validators';

export default Ember.Route.extend({
  model() {
    const validations = {
      groupName: validatePresence(true),
    };

    // @todo: replace peekAll() - should we have static or dynamic content inside
    return Ember.RSVP.hash({
      resources: this.store.peekAll('resource'),
      validations,
    });
  },
});
