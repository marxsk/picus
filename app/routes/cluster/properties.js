import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  queryParams: {
    filterString: {
      as: 's',
      replace: true
    }
  },
  actions: {
    pageRefresh() {
      this.refresh();
    }
  },

  setupController(controller, model) {
    this._super(controller, model);
    // hide sidebar menu
    this.controllerFor('application').set('hideMainMenu', false);
   },

  model({filterString, advanced}) {
    const advancedBoolean = advanced ? true : false;

    return Ember.RSVP.hash({
      filterProperties: filterString,
      showAdvanced: advancedBoolean,
      cluster: this.store.peekAll('cluster'),
    });
  }
});
