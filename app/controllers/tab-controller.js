import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['activeTab'],
  application: Ember.inject.controller(),
  isModalActive: Ember.computed.alias('application.isModalActive'),
  modalInformation: Ember.computed.alias('application.modalInformation'),

  actions: {
    setActiveTab(tabAction, tabName) {
      tabAction(tabName);
      this.set('activeTab', tabName);
    },
    // @todo: [refactor] does it make sense to use bubbling? or it is even possible?
    toggleModal() {
      this.get('application').send('toggleM');
    }
  }
});
