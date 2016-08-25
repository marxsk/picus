import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    this.store.reloadData();

    return this.store.peekAll('cluster');
  }
});
