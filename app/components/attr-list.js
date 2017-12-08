import Ember from 'ember';

/**
 * Component that creates a table with an array of record.
 *
 * Every record is represented by a single line (via attr-single) that provides
 * checkbox and 'delete' text. This component stores checked lines what allows
 * to have actions that are built on top of the multiple records.
 */
export default Ember.Component.extend({
  title: undefined,
  /**
   * Attributes is an array of records that will be presented in the table
   *
   * @property attributes
   * @type {DS.Model[]}
   * @public
   */
  attributes: undefined,
  onDeleteAction: undefined,
  /**
   * [optional] Action that deletes multiple records at once.
   *
   * @default actions.naiveDeleteMultipleAction
   * @public
   */
  onDeleteMultipleAction: undefined,

  /**
   * Text shown when 'attributes' is empty
   *
   * @default: 'No entries'
   * @public
   * */
  emptyText: 'No Entries',

  _checkedAttributes: Ember.A(),
  /**
   * Object that holds information from form used to append records.
   *
   * The only reason why there is such object is that we want to clear form
   * fields after submitting the data.
   *
   * @private
   */
  formEntry: null,

  init() {
    this._super();
    this.set('formEntry', {});
  },

  actions: {
    onCheckAction(attribute, isChecked) {
      if (isChecked === true) {
        this.get('_checkedAttributes').pushObject(attribute);
      } else {
        this.get('_checkedAttributes').removeObject(attribute);
      }
    },

    /**
     *  Naive solution to removing multiple records
     *
     *  @private
     */
    naiveDeleteMultipleAction(attributes) {
      if (attributes === undefined) {
        return;
      }

      attributes.forEach((attr) => {
        this.attrs.onDeleteAction(attr);
      });
    },
  },
});
