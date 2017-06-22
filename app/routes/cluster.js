import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel(transition) {
    if ('cluster' in transition.state.params) {
      return this.store.setActiveClusterName(transition.state.params.cluster.cluster_name);
    }
  },

  actions: {
    error: function(error, transition) {
      this.transitionTo('error');
    },
  }
});