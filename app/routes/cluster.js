import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel(transition) {
    if ('cluster' in transition.state.params) {
      return this.store.setActiveClusterName(transition.state.params.cluster.cluster_name);
    }

    return undefined;
  },

  actions: {
    error(error, transition) {
      this.controllerFor('application').set('errorMessage', error);
      this.transitionTo('error');
    },
  },
});
