import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    let modelForm = {
      nodeName: 'foo',
      autoStart: true,
    };

    return Ember.RSVP.hash({
      formData: modelForm,
    });
  }
});
