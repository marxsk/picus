import TabController from '../../tab-controller';

export default TabController.extend({
  queryParams: ['filterString'],
  filterString: '',
  activeTab: 'status',
  notifications: Ember.inject.service('notification-messages'),

  actions: {
    removeNotification(modalInformation) {
      this.get('notifications').removeNotification(modalInformation.notification);
      this.get('application').send('toggleM');
    },
  }
});
