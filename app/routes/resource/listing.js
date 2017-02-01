import Ember from 'ember';

// very same as fence/listing
export default Ember.Route.extend({
  templateName: 'resource/show',

  beforeModel() {
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
