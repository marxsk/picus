import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  redirect(model, transition) {
    if (['nodes.index', 'nodes.listing'].indexOf(transition.targetName) >= 0) {
      this.transitionTo('nodes.show', '');
    }
  }
});
