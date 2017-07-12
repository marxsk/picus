import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['activeTab'],
  activeTab: 'users',

  actions: {
    setActiveTab(tabAction, tabName) {
      tabAction(tabName);
      this.set('activeTab', tabName);
    }
  }
});
