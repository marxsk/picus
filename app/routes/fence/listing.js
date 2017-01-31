import Ember from 'ember';

export default Ember.Route.extend({
  templateName: 'fence/show',

  beforeModel(transition) {
    return this.store.reloadData();
  },

  model(params) {
    return Ember.RSVP.hash({
      listing: true,
      params: params,
      cluster: this.store.peekAll('cluster'),
    });
  },
  actions: {
    onCheck: function() {

    }
  },
});
