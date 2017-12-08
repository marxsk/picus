import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['activeTab'],
  application: Ember.inject.controller(),

  actions: {
    setActiveTab(tabAction, tabName) {
      tabAction(tabName);
      this.set('activeTab', tabName);
    },
  },
});
