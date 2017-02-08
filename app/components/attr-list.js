import Ember from 'ember';

export default Ember.Component.extend({
  title: undefined,
  attributes: undefined,
  onDeleteAction: undefined,
  onAppendAction: undefined,
  onDeleteMultipleAction: undefined,

  selectedAttributes: Ember.A(),

  attr: null,

  init() {
    this._super();
    this.set('attr', {});
  },

  actions: {
    appendCleanAction: function(attributes) {
      this.attrs.onAppendAction(attributes, this.get('attr'));
      this.set('attr', {});
    },
    onCheckAction: function(attribute, isChecked) {
      if (isChecked === true) {
        this.get('selectedAttributes').pushObject(attribute);
      } else {
        this.get('selectedAttributes').removeObject(attribute);
      }
    },
  }
});
