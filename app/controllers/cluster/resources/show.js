import Ember from 'ember';
import TabController from '../../tab-controller';

export default TabController.extend({
  queryParams: ['filterString'],
  filterString: '',
  activeTab: 'status',

  appController: Ember.inject.controller('application'),

  showAddMetaAttribute: false,
  empty: {},

  _triggerUrlRefresh(search) {
    this.set('filterString', search);
    this.send('pageRefresh');
  },

  actions: {
    clearForm() {
      this.set('empty', {});
    },
    urlRefresh(search) {
      Ember.run.debounce(this, '_triggerUrlRefresh', search, 300);
    },
  },
});
