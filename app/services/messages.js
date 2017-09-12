import Ember from 'ember';

const messages = {
  FORCE_ADD_META_ATTRIBUTE: {
    progress: (notification) => `Forcing add meta attribute ...`,
    success: (notification) => `Meta Attribute ${notification.get('data.record.name')} for resource ${notification.get('data.record.resource.name')} was added`,
    error: (notification) => `Something is wrong`,
  },
  FORCE_ADD_UTILIZATION_ATTRIBUTE: {
    progress: (notification) => `Forcing add utilization attribute ...`,
    success: (notification) => `Utilization Attribute ${notification.get('data.record.name')} for resource ${notification.get('data.record.resource.name')} was added`,
    error: (notification) => `Something is wrong`,
  },
  ADD_META_ATTRIBUTE: {
    progress: (notification) => `Adding meta attribute ${notification.attributeKey} for resource ${notification.resourceName}`,
    success: (notification) => `Meta Attribute ${notification.attributeKey} for resource ${notification.resourceName} was added`,
    error: (notification) => `Someting is wrong with ${notification.attributeKey}`,
  },
  ADD_UTILIZATION_ATTRIBUTE: {
    progress: (notification) => `Adding utilization attribute ${notification.attributeName} for resource ${notification.resourceName}`,
    success: (notification) => `Utilization Attribute ${notification.attributeName} for resource ${notification.resourceName} was added`,
    error: (notification) => `Someting is wrong with ${notification.attributeName}`,
  }
}

export default Ember.Service.extend({
  getNotificiationMessage(notification, messageCode) {
    let notificationMessage = {};

    if (messageCode in messages) {
      notificationMessage.success = messages[messageCode].success(notification);
      notificationMessage.progress = messages[messageCode].progress(notification);
      notificationMessage.error = messages[messageCode].error(notification);
    } else {
      notificationMessage.success = 'Success';
      notificationMessage.progress = 'Progress';
      notificationMessage.error = 'Error';
    }

    return notificationMessage;
  }
});
