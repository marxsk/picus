import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    const z = this.controllerFor('application').get('errorMessage');

    return Ember.RSVP.hash({
      errorMessage: z.stack,
    });
  },
});
