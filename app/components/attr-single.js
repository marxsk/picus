import Ember from 'ember';

/**
 * Component that describes single line in the attr-list table.
 *
 * Every line can be deleted (via 'onDeleteAction') and can be checked
 * to proper action over multiple lines.
 */
export default Ember.Component.extend({
  /**
   * Attribute contains information for a given record.
   *
   * @property attribute
   * @type {DS.Model}
   * @public
   * */
  attribute: undefined,
  onDeleteAction: undefined,
  onCheckAction: undefined,

  /**
   * Tag to encapsulate content.
   *
   * @private
   */
  tagName: 'tr',
  isChecked: false,

  toggleCheck(value) {
    this.set('isChecked', value);
    this.attrs.onCheckAction(this.get('attribute'), this.get('isChecked'));
  },
});
