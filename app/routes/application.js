import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  actions: {
    setActiveNotification(notification) {
      this.controller.get('appController').set('activeNotification', notification);
    },
    unsetActiveNotification() {
      this.controller.get('appController').set('activeNotification', undefined);
    },
  },
});
