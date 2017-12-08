import Ember from 'ember';

export default Ember.Route.extend({
  redirect(model, transition) {
    if (['cluster.fences.index', 'cluster.fences.listing'].indexOf(transition.targetName) >= 0) {
      this.transitionTo('cluster.fences.show', '');
    }
  },
});
