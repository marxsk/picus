import Ember from 'ember';
import TabController from '../../tab-controller';

export default TabController.extend({
  queryParams: ['filterString'],
  filterString: '',
  activeTab: 'status',

  appController: Ember.inject.controller('application'),

  showAddMetaAttribute: false,
  empty: {},

  actions: {
    clearForm() {
      this.set('empty', {});
    },
  },
});
