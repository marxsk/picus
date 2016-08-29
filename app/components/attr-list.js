import Ember from 'ember';

export default Ember.Component.extend({
  title: undefined,
  attributes: undefined,
  onDeleteAction: undefined,
  onAppendAction: undefined,

  attrKey: '',
  attrValue: '',

  actions: {
    appendCleanAction: function() {
      this.attrs.onAppendAction(this.get('attrKey'), this.get('attrValue'));
      this.set('attrKey', '');
      this.set('attrValue', '');
    },
  }
});
