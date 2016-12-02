import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    onSubmitAction: function(changeset) {
      this.store.pushNewNode({
        nodeName: changeset.get('nodeName'),
        autoStart: changeset.get('autoStart'),
      });
      this.transitionToRoute('nodes.listing');
    },
  }
});
