import Ember from 'ember';

export default Ember.Route.extend({
  redirect(model, transition) {
    if (['resources.index', 'resources.listing'].indexOf(transition.targetName) >= 0) {
      this.transitionTo('resources.show', '');
    }
  }
});
