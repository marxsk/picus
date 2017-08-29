import NotificationsService from 'ember-cli-notifications/services/notification-messages-service';
import Ember from 'ember';

export default NotificationsService.extend({
    progress(message, options) {
      return this.addNotification(Ember.assign({
        message: message,
        type: 'success'
      }, options));
    },
})
