import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  isModalActive: false,
  modalInformation: undefined,

  actions: {
      invalidateSession() {
        this.get('session').invalidate();
      },
      toggleM() {
        this.toggleProperty('isModalActive');
      }
    },
});
