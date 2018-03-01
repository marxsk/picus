import Ember from 'ember';
import BaseController from 'picus/controllers/base-controller';

export default BaseController.extend({
  queryParams: ['activeTab'],
  application: Ember.inject.controller(),

  actions: {
    setActiveTab(tabAction, tabName) {
      tabAction(tabName);
      this.set('activeTab', tabName);
    },
  },
});
