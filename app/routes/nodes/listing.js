import Ember from 'ember';

export default Ember.Route.extend({
  templateName: 'nodes/show',
  controllerName: 'nodes/show',

  model(params) {
    return Ember.RSVP.hash({
      xyz: this.store.reloadData(),
      params: params,
      cluster: this.store.peekAll('cluster'),
    });
  }
});
