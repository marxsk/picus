import Ember from 'ember';

export default Ember.Route.extend({
  redirect(model, transition) {
    if (transition.targetName == 'nodes.index') {
      this.transitionTo('nodes.listing');
    };
  }
});
