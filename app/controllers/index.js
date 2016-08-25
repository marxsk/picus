import Ember from 'ember';

export default Ember.Controller.extend({
  selectedComponentId: undefined,

  actions: {
    onClick: function(componentId) {
      this.set('selectedComponentId', componentId);
    },
    onCheck: function() {
    }
  }
});
