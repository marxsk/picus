import Ember from 'ember';

const messages = {
  ADD_META_ATTRIBUTE: {
    progress: notification =>
      `Adding meta attribute ${notification.get('data.record.key')} for resource ${notification.get('data.record.resource.name')}`,
    success: notification =>
      `Meta Attribute ${notification.get('data.record.key')} for resource ${notification.get('data.record.resource.name')} was added`,
    error: notification => `Someting is wrong with ${notification.get('data.record.key')}`,
  },
  FORCE_ADD_META_ATTRIBUTE: {
    progress: notification => 'Forcing add meta attribute ...',
    success: notification =>
      `Meta Attribute ${notification.get('data.record.name')} for resource ${notification.get('data.record.resource.name')} was added`,
    error: notification => 'Something is wrong',
  },
  ADD_UTILIZATION_ATTRIBUTE: {
    progress: notification =>
      `Adding utilization attribute ${notification.get('data.record.name')} for resource ${notification.get('data.record.resource.name')}`,
    success: notification =>
      `Utilization Attribute ${notification.get('data.record.name')} for resource ${notification.get('data.record.resource.name')} was added`,
    error: notification => `Someting is wrong with ${notification.get('data.record.name')}`,
  },
  FORCE_ADD_UTILIZATION_ATTRIBUTE: {
    progress: notification => 'Forcing add utilization attribute ...',
    success: notification =>
      `Utilization Attribute ${notification.get('data.record.name')} for resource ${notification.get('data.record.resource.name')} was added`,
    error: notification => 'Something is wrong',
  },
  ADD_ACL_ROLE: {
    progress: notification => `Adding ACL Role ${notification.get('data.record.name')}`,
    success: notification => `ACL Role ${notification.get('data.record.name')} was added`,
    error: notification => 'Something is wrong',
  },
  DELETE_ACL_ROLE: {
    progress: notification => `Removing ACL Role ${notification.get('data.record.name')}`,
    success: notification => `ACL Role ${notification.get('data.record.name')} was removed`,
    error: notification => 'Something is wrong',
  },
  // @todo: Add messages for:
  //  (ADD/FORCE_ADD/DELETE)_LOCATION_PREFERENCE
  //  (ADD/FORCE_ADD/DELETE)_COLOCATION_PREFERENCE
  //  (ADD/FORCE_ADD/DELETE)_ORDERING_PREFERENCE
  //  (ADD/FORCE_ADD/DELETE)_TICKET_PREFERENCE
};

export default Ember.Service.extend({
  getNotificiationMessage(notification, messageCode) {
    const notificationMessage = {};

    if (messageCode in messages) {
      notificationMessage.success = messages[messageCode].success(notification);
      notificationMessage.progress = messages[messageCode].progress(notification);
      notificationMessage.error = messages[messageCode].error(notification);
    } else {
      Ember.Logger.warn(`Using default text in the notification for "${messageCode}"`);
      notificationMessage.success = 'Success';
      notificationMessage.progress = 'Progress';
      notificationMessage.error = 'Error';
    }

    return notificationMessage;
  },
});
