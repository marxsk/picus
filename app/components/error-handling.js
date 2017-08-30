import Ember from 'ember';

export default Ember.Component.extend({
  notifications: Ember.inject.service('notifications'),
  messages: Ember.inject.service('messages'),
  activeNotification: Ember.computed.alias('appController.activeNotification'),

  actions: {
    unsetActiveNotification() {
      this.get('appController').send('unsetActiveNotification');
    },
    removeNotification(notification) {
      notification.get('data.record').rollbackAttributes();
      this.get('notifications').removeNotification(notification);
      this.send('unsetActiveNotification');
    },
    forceRecordSave(notification) {
      const notificationMessages = this.get('messages').getNotificiationMessage(notification, `FORCE_${notification.get('data.action')}`);

      const progressNotification = this.get('notifications').progress(notificationMessages.progress);
      notification.get('data.record').save({
        adapterOptions: {
          force: true,
        }
      }).then(() => {
        this.get('notifications').updateNotification(
          progressNotification,
          'SUCCESS',
          notificationMessages.success);
      }, (xhr) => {
        this.get('notifications').updateNotification(
          progressNotification,
          'ERROR',
          notification.get('data.record.resource.name') + '::' + xhr.responseText,
          {
            action: notification.get('data.action'),
            record: notification.get('data.record'),
            response: xhr,
          }
        )
      });
      this.send('unsetActiveNotification');
      this.get('notifications').removeNotification(notification);
    }
  }
});
