import NotificationsService from 'ember-cli-notifications/services/notification-messages-service';
import Ember from 'ember';

/** Notification services tightly integrated with our application

  This class encapsulates also business logic of application .save()
  so we can easilly react to responses from the server without worrying
  about current cluster status. Text of notification messages is obtained
  from 'messages' service that contains all texts that are not part of the
  templates (and are not for internal use only).
* */
export default NotificationsService.extend({
  /** Human-readable texts for predefined actions on models

      @property messages
      @private
    * */
  messages: Ember.inject.service('messages'),

  /** Show notification message for action in progress

     @public
     @param {string} message - Text message to show
     @param {Object} options - @todo is this even used?
    * */
  progress(message, options) {
    return this.addNotification(Ember.assign(
      {
        message,
        type: 'success',
      },
      options,
    ));
  },

  /** Show notification message for successfuly completed action

     @public
     @param {string} message - Text message to show
     @param {Object} options - @todo is this even used?
    * */
  success(message, options) {
    return this.addNotification(Ember.assign(
      {
        message,
        type: 'info',
      },
      options,
    ));
  },

  /** Update existing notification

      In the update, we can change both message and type of the action.
      The main usage is to change type of the notification from in-progress to
      the final state (success|error) without removing/adding new notification.
      Changing the type also changes all the relevant attributes
      including reaction to onClick action.

      @param {Object} notification - Existing notification
      @param {String} type - (SUCCESS|ERROR)
      @param {String} message - HTML message to show
      @param {Object} data - @todo improve; object on which we are performing action
    * */
  updateNotification(notification, type, message, data = {}) {
    if (type === 'SUCCESS') {
      this.changeNotification(notification, {
        message,
        htmlContent: true,
        type: 'info',
        autoClear: true,
        clearDuration: 2400,
        onClick: (clickedNotification) => {
          this.removeNotification(clickedNotification);
        },
      });
    } else if (type === 'ERROR') {
      this.changeNotification(notification, {
        message,
        htmlContent: true,
        type: 'error',
        data,
        onClick: (clickedNotification) => {
          Ember.getOwner(this)
            .lookup('route:application')
            .send('setActiveNotification', clickedNotification);
        },
      });
    }
  },

  /** Save record to the backend and create/update notification

      Saving record to the backend creates a new notification (in-progress)
      and when action save() is finished it do a transition into (success|error)
      state.

      @note It might look strange to do saving of records in almost-logging
      but we want to react to the response. This function can be easilly moved
      elsewhere if we find a better place.

      @param {Ember.Object} record - Record that we perform action on
      @param {String} actionName - Name of the action determines messages shown in the notification
    * */
  notificationSaveRecord(record, actionName, prom = undefined) {
    const notificationData = Ember.Object.create({
      data: {
        action: actionName,
        record,
      },
    });
    const messages = this.get('messages').getNotificiationMessage(notificationData, actionName);

    let savingPromise = prom;
    if (savingPromise === undefined) {
      savingPromise = record.save();
    }

    const progressNotification = this.progress(messages.progress);
    savingPromise.then(
      () => {
        this.updateNotification(progressNotification, 'SUCCESS', messages.success);
      },
      (xhr) => {
        this.updateNotification(progressNotification, 'ERROR', messages.error, {
          action: notificationData.get('data.action'),
          record: notificationData.get('data.record'),
          response: xhr,
        });
      },
    );

    return Ember.RSVP.Promise.resolve();
  },
});
