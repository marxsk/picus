import Ember from 'ember';

const messages = {
  'FORCE_ADD_META_ATTRIBUTE': {
    success: (notification) => `Meta Attribute ${notification.get('data.record.key')} for resource ${notification.get('data.record.resource.name')} was added`,
    progress: (notification) => `Forcing add meta attribute ...`,
  },
  'FORCE_ADD_UTILIZATION_ATTRIBUTE': {
    success: (notification) => `Utilization Attribute ${notification.get('data.record.name')} for resource ${notification.get('data.record.resource.name')} was added`,
    progress: (notification) => `Forcing add utilization attribute ...`,
  }
}

export default Ember.Service.extend({
  getNotificiationMessage(notification, messageCode) {
    let notificationMessage = {};

    if (messageCode in messages) {
      notificationMessage.success = messages[messageCode].success(notification);
      notificationMessage.progress = messages[messageCode].progress(notification);
    } else {
      notificationMessage.success = 'Success';
      notificationMessage.progress = 'Progress';
    }

    return notificationMessage;
  }
});
