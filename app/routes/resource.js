import Ember from 'ember';

export default Ember.Route.extend({
  redirect(model, transition) {
    if (transition.targetName === 'resource.index') {
      this.transitionTo('resource.listing');
    }
  }
});
