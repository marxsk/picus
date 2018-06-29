import Ember from 'ember';
// import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      clusters: this.store.loadClusters(),
    });
  },
});
