import Ember from 'ember';

export default Ember.Route.extend({
  selectedNode: undefined,

  model(params) {
    return Ember.RSVP.hash({
      params,
      updatingCluster: this.store.peekAll('cluster'),
      selectedNode: this.store.peekRecord('node', params.node_id),
    });
  },

  actions: {
    onClick(component) {
      this.set('selectedNode', component);
    },
    onCheck() {},

    appendNodeAttribute(attributes, attr) {
      const { store } = this;
      const newAttribute = store.createRecord('attribute', attr);
      attributes.pushObject(newAttribute);
      newAttribute.save();
    },
    deleteNodeAttribute(attribute) {
      attribute.deleteRecord();
      attribute.save();
    },
    deleteMultipleAttributes(attributes) {
      attributes.forEach((item) => {
        item.deleteRecord();
        item.save();
      });
    },
    appendNodeUtilizationAttribute(attributes, attr) {
      const { store } = this;
      const newAttribute = store.createRecord('attribute', attr);
      attributes.pushObject(newAttribute);
      newAttribute.save();
    },
    nodeAction(action, component) {
      switch (action) {
        case 'start':
        case 'stop':
        case 'reboot':
          break;
        default:
          break;
      }
    },
  },
});
