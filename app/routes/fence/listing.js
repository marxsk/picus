import Ember from 'ember';

export default Ember.Route.extend({
//  templateName: 'fence/show',
//  controllerName: 'fence/show',

  model(params) {
    console.log('123');
    return Ember.RSVP.hash({
      params: params,
    })
  }
});
