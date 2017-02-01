import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    filterString: {
      as: 's',
      replace: true
    }
  },
  actions: {
    pageRefresh() {
      this.refresh();
    }
  },
  model({filterString, advanced}) {
    const advancedBoolean = advanced ? true : false;
    // @fix-reload
    this.store.reloadData();

    return Ember.RSVP.hash({
      filterProperties: filterString,
      showAdvanced: advancedBoolean,
      cluster: this.store.peekAll('cluster'),
    });
  }
});