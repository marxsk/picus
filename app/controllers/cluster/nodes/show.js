import Ember from 'ember';
import TabController from 'picus/controllers/tab-controller';

// @todo: absolute clone of controllers/cluster/resources/show

export default TabController.extend({
  queryParams: ['filterString', 'showInternalNames'],
  filterString: '',
  activeTab: 'status',

  appController: Ember.inject.controller('application'),

  showAddMetaAttribute: false,
  showInternalNames: false,

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
    toggleInternalNames() {
      this.toggleProperty('showInternalNames');
      this.send('pageRefresh');
    },
  },
});
