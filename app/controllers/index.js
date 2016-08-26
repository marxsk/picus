import Ember from 'ember';

export default Ember.Controller.extend({
  selectedComponentId: undefined,
  selectedComponent: undefined,

  actions: {
    onClick: function(component, componentId) {
      this.set('selectedComponentId', componentId);
      this.set('selectedComponent', component);
    },
    onCheck: function() {
    }
  }
});
