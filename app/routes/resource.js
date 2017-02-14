import Ember from 'ember';

export default Ember.Route.extend({
  redirect(model, transition) {
    if (['resource.index', 'resource.listing'].indexOf(transition.targetName) >= 0) {
      this.transitionTo('resource.show', '');
    }
  }
});
