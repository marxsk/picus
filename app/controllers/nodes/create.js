import Ember from 'ember';

export default Ember.Controller.extend({
  validResources: Ember.A(),
  groupedResources: Ember.A(),

  init: function() {
    this.get('validResources').pushObject({name: 'abc'});
    this.get('validResources').pushObject({name: 'def'});
    this.get('validResources').pushObject({name: 'xyz'});
  },

  actions: {
    onSubmitAction: function(changeset) {
      this.store.pushNewNode({
        nodeName: changeset.get('nodeName'),
        autoStart: changeset.get('autoStart'),
      });
      this.transitionToRoute('nodes.show', '');
    },
    increaseRating: function(xyz) {
      console.log('to1');
      this.get('groupedResources').removeObject(xyz);
      this.get('validResources').addObject(xyz);
    },
    increaseRating2: function(xyz) {
      console.log('to2');
      console.log(this.get('model.resources.length'));
      this.get('validResources').removeObject(xyz);
      this.get('groupedResources').addObject(xyz);
    },
    sortEndAction: function() {
      console.log(this.get('groupedResources'));
    }
  }
});
