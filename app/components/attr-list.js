import Ember from 'ember';

export default Ember.Component.extend({
  title: undefined,
  attributes: undefined,
  onDeleteAction: undefined,
  onAppendAction: undefined,
  onDeleteMultipleAction: undefined,

  selectedAttributes: Ember.A(),

  attrKey: '',
  attrValue: '',

  actions: {
    appendCleanAction: function() {
      this.attrs.onAppendAction(this.get('attrKey'), this.get('attrValue'));
      this.set('attrKey', '');
      this.set('attrValue', '');
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
