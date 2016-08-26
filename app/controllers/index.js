import Ember from 'ember';

export default Ember.Controller.extend({
  selectedComponentId: undefined,
  selectedComponent: undefined,

  isSelectedNode: Ember.computed('selectedComponent', function() {
    if (this.get('selectedComponent')) {
      return (this.get('selectedComponent').toString().indexOf('@model:node::') > -1);
    } else {
      return false;
    }
  }),

  actions: {
    onClick: function(component, componentId) {
      this.set('selectedComponentId', componentId);
      this.set('selectedComponent', component);
    },
    onCheck: function() {
    }
  }
});
