import Ember from 'ember';

export default Ember.Route.extend({
  redirect(model, transition) {
    if (transition.targetName === 'cluster.resources.listing') {
      this.transitionTo('cluster.resources.index');
    }
  }
});
