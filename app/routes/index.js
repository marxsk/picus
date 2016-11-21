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
  model({search}) {
    if (!search) {
      this.store.reloadData();
    }

    return this.store.peekAll('cluster');
  }
});
