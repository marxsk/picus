import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    this.store.reloadData();

    return Ember.RSVP.hash({
      listing: (params.node_id.length === 0) ? true : false,
      xyz: this.store.reloadData(),
      params: params,
      cluster: this.store.peekAll('cluster'),
      selectedNode: this.store.filter('node', (item) => { return item.id === params.node_id; }),
    });
  },
});
