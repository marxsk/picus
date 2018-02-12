import Ember from 'ember';

export default Ember.Route.extend({
  redirect(model, transition) {
    if (['cluster.nodes.index', 'cluster.nodes.listing'].indexOf(transition.targetName) >= 0) {
      this.transitionTo('cluster.nodes.show', '');
    }
  },
});
