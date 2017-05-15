import Ember from 'ember';

export default Ember.Route.extend({
  redirect(model, transition) {
    if (transition.targetName === 'resources.listing') {
      this.transitionTo('resources.index');
    }
  }
});
