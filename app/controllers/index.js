import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['filterString'],
  selectedComponentId: undefined,
  selectedComponent: undefined,
  filterString: '',

  isSelectedNode: Ember.computed('selectedComponent', function() {
    if (this.get('selectedComponent')) {
      return (this.get('selectedComponent').toString().indexOf('@model:node::') > -1);
    } else {
      return false;
    }
  }),

  actions: {
    onSearch: function(search) {
      this.set('filterString', search);
      this.send('pageRefresh', search);
    },
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
    submitProperties: function(properties, changeset) {
      // update values locally
      for (let attrName in changeset.get('change')) {
        properties.forEach(function(item, index) {
          if (item.get('name') === attrName) {
            item.set('value', changeset.get(attrName));
          }
        });
      }

      // save changes to remote server
      this.store.pushClusterProperties(changeset);
    }
  }
});
