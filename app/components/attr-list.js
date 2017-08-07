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
  onAppendAction: undefined,
  /**
   * [optional] Action that deletes multiple records at once.
   *
   * @default actions.naiveDeleteMultipleAction
   * @public
   */
  onDeleteMultipleAction: undefined,

  checkedAttributes: Ember.A(),
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
    appendCleanAction: function(attributes) {
      this.attrs.onAppendAction(attributes.get('change'));
      this.set('formEntry', {});

      // @todo: ember-form-for requires a promise to re-enable Submit button
      // it may be better to use returned promise from onAppendAction
      return Ember.RSVP.resolve();
    },
    onCheckAction: function(attribute, isChecked) {
      if (isChecked === true) {
        this.get('checkedAttributes').pushObject(attribute);
      } else {
        this.get('checkedAttributes').removeObject(attribute);
      }
    },

    /**
     *  Naive solution to removing multiple records
     *
     *  @private
     */
    naiveDeleteMultipleAction: function(attributes) {
      attributes.forEach((attr) => {
        this.attrs.onDeleteAction(attr);
      });
    }
  }
});
