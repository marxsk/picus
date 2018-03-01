import Ember from 'ember';

/**
  Base controller class encapsulating standard query parameters

  The main intention for this controller is to be used with agent-properties
  component. But as we use tabs for navigation as well, it have to be used
  also in places where the component is not visible. So it is designed to make
  no harm even when its functionality is not required.
 */
export default Ember.Controller.extend({
  /**
    Define parameters that are obtained from the query/URL

    It is not an issue when parameters are not used, so there is
    no reason why to not use this class. Their default values should
    be defined afterwards. We prefer to have a real value (if possible)
    instead of null/undefined.

    @property queryParams
  */
  queryParams: ['filterString', 'showInternalNames'],
  filterString: '',
  showInternalNames: false,

  /**
    @todo why do need it ??

    @property appController
   */
  appController: Ember.inject.controller('application'),

  _triggerUpdateFilterString(search) {
    this.set('filterString', search);
  },

  actions: {
    updateFilterString(filterString) {
      /**
        Update filter string obtained from a component

        We do not use Ember.set() method directly because we don't want
        to change filtering immediately. We wait 300ms after last change
        in the component to really change filtering string.
       */
      Ember.run.debounce(this, '_triggerUpdateFilterString', filterString, 300);
    },
    toggleInternalNames() {
      this.toggleProperty('showInternalNames');
    },
  },
});
