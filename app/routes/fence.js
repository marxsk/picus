import Ember from 'ember';

export default Ember.Route.extend({
  redirect(model, transition) {
    if (transition.targetName === 'fence.index') {
      this.transitionTo('fence.listing');
    }
  }
});
