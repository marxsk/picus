import NotificationsService from 'ember-cli-notifications/services/notification-messages-service';
import Ember from 'ember';

export default NotificationsService.extend({
    messages: Ember.inject.service('messages'),

    progress(message, options) {
      return this.addNotification(Ember.assign({
        message: message,
        type: 'success'
      }, options));
    },

    success(message, options) {
      return this.addNotification(Ember.assign({
        message: message,
        type: 'info',
      }, options));
    },

    updateNotification(notification, type, message, data={}) {
      if (type === 'SUCCESS') {
        this.changeNotification(notification, {
          message,
          htmlContent: true,
          type: 'info',
          autoClear: true,
          clearDuration: 2400,
          onClick: (notification) => {
            this.removeNotification(notification);
          }
        });
      } else if (type === 'ERROR') {
        this.changeNotification(notification, {
          message,
          htmlContent: true,
          type: 'error',
          data,
          onClick: (notification) => {
            Ember.getOwner(this).lookup('route:application').send('setActiveNotification', notification);
          }
        });
      }
    },

    notificationSaveRecord(record, actionName) {
      const notificationData = Ember.Object.create(
        {
          data: {
            action: actionName,
            record: record,
          }
        }
      );
      const messages = this.get('messages').getNotificiationMessage(notificationData, actionName);

      const progressNotification = this.progress(messages.progress);
      record.save().then(() => {
        this.updateNotification(
          progressNotification,
          'SUCCESS',
          messages.success
        );
      }, (xhr) => {
        this.updateNotification(
          progressNotification,
          'ERROR',
          messages.error,
          {
            action: notificationData.action,
            record: notificationData.record,
            response: xhr,
          }
        );
      });

      return Ember.RSVP.Promise.resolve();
    },
});
