import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    const modelForm = {
      nodeName: '',
      autoStart: true,
    };

    return Ember.RSVP.hash({
      formData: modelForm,
    });
  },
  actions: {
    onSubmitAction(changeset) {
      this.store.pushNewNode({
        nodeName: changeset.get('nodeName'),
        autoStart: changeset.get('autoStart'),
      });
      this.transitionTo('cluster.nodes.show', '');
    },
  },
});
