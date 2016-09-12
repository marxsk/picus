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
    },
    appendNodeAttribute: function(key, value) {
      var store = this.store;
      var newAttribute = store.createRecord('attribute', { key, value });

      this.get('selectedComponent').get('nodeAttributes').pushObject(newAttribute);
      newAttribute.save();
    },
    deleteNodeAttribute: function(attribute) {
      attribute.deleteRecord();
      attribute.save();
    },
    deleteMultipleAttributes: function(attributes) {
      attributes.forEach((item) => {
        item.deleteRecord();
        item.save();
      });
    },
    appendNodeUtilizationAttribute: function(key, value) {
      var store = this.store;
      var newAttribute = store.createRecord('attribute', { key, value });

      this.get('selectedComponent').get('nodeUtilizationAttributes').pushObject(newAttribute);
      newAttribute.save();
    },
    forceReload: function() {
      this.store.reloadData();
    },
    nodeAction: function(action, component) {
      switch(action) {
        case 'start':
        case 'stop':
        case 'reboot':
          console.log(action + ' node ' + component.get('name'));
          break;
        default:
          console.log('invalid action ' + action + 'on node ' + component.get('name'));
          // @todo: error
          break;
      }
    },
  }
});
