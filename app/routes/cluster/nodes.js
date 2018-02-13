import Ember from 'ember';

export default Ember.Route.extend({
  redirect(model, transition) {
    if (transition.targetName === 'cluster.nodes.listing') {
      this.transitionTo('cluster.nodes.index');
    }
  },
});
