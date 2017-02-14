import Ember from 'ember';

export default Ember.Route.extend({
  redirect(model, transition) {
    if (['fence.index', 'fence.listing'].indexOf(transition.targetName) >= 0) {
      this.transitionTo('fence.show', '');
    }
  }
});
