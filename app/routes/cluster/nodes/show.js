import Ember from 'ember';

export default Ember.Route.extend({
  selectedNode: undefined,

  model(params) {
    return Ember.RSVP.hash({
      listing: (params.node_id.length === 0) ? true : false,
      params: params,
      cluster: this.store.peekAll('cluster'),
      selectedNode: this.store.filter('node', (item) => { return item.id === params.node_id; }),
    });
  },

  actions: {
    onClick: function(component) {
      this.set('selectedNode', component);
    },
    onCheck: function() {    },

    appendNodeAttribute: function(attributes, attr) {
      var store = this.store;
      var newAttribute = store.createRecord('attribute', attr);
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
    appendNodeUtilizationAttribute: function(attributes, attr) {
      var store = this.store;
      var newAttribute = store.createRecord('attribute', attr);
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
