import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['activeTab'],

  actions: {
    setActiveTab(tabAction, tabName) {
      tabAction(tabName);
      this.set('activeTab', tabName);
    }
  }
});
