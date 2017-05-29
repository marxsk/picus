import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),

  actions: {
    authenticate(identification, password) {
      this.get('session').authenticate('authenticator:cookie-authenticator', {identification, password}).catch((reason) => {
        this.set('errorMessage', 'Invalid username or password');
      });
    }
  }
});
