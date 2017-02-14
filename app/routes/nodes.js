import Ember from 'ember';

export default Ember.Route.extend({
  redirect(model, transition) {
    if (['nodes.index', 'nodes.listing'].indexOf(transition.targetName) >= 0) {
      this.transitionTo('nodes.show', '');
    }
  }
});
