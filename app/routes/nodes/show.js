import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    this.store.reloadData();

    return Ember.RSVP.hash({
      params: params,
      cluster: this.store.peekAll('cluster'),
      selectedNode: this.store.filter('node', (item) => { return item.id === params.node_id}),
    })
  }
});
