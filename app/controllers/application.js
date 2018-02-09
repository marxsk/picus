import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  appController: Ember.inject.controller('application'),
  activeNotification: undefined,
  errorMessage: '',

  actions: {
    invalidateSession() {
      this.get('session').invalidate();
    },
  },
});
