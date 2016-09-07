import Ember from 'ember';

export default Ember.Component.extend({
  attribute: undefined,
  onDeleteAction: undefined,
  onCheckAction: undefined,

  isChecked: false,

  watchChecked: function() {
    this.attrs.onCheckAction(this.get('attribute'), this.get('isChecked'));
  }.observes('isChecked'),
});
