import Ember from 'ember';

export default Ember.Route.extend({
  redirect(model, transition) {
    if (['fences.index', 'fences.listing'].indexOf(transition.targetName) >= 0) {
      this.transitionTo('fences.show', '');
    }
  }
});
