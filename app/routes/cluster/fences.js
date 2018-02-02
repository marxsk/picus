import Ember from 'ember';

export default Ember.Route.extend({
  redirect(model, transition) {
    if (transition.targetName === 'cluster.fences.listing') {
      this.transitionTo('cluster.fences.index');
    }
  },
});
