import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  redirect(model, transition) {
    if (['cluster.nodes.index', 'cluster.nodes.listing'].indexOf(transition.targetName) >= 0) {
      this.transitionTo('cluster.nodes.show', '');
    }
  },
});
