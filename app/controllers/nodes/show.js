import Ember from 'ember';

export default Ember.Controller.extend({
  selectedNode: undefined,

  actions: {
    onClick: function(component, componentId) {
      this.set('selectedNode', component);
    },
    onCheck: function() {    },

    appendNodeAttribute: function(attributes, key, value) {
      var store = this.store;
      var newAttribute = store.createRecord('attribute', { key, value });
      attributes.pushObject(newAttribute);
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
    appendNodeUtilizationAttribute: function(attributes, key, value) {
      var store = this.store;
      var newAttribute = store.createRecord('attribute', { key, value });
      attributes.pushObject(newAttribute);
      newAttribute.save();
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
