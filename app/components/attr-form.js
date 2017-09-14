import Ember from 'ember';

/**
 * Component that creates an empty form that can be shown/hidden easilly
 *
 * There are a lot of cases in picus where we have a table displaying the list
 * of records and we need to add a new records inside. This component creates the
 * button that controls if form is visible. Form itself is defined by user (follow
 * ember-form-for fields), at the start the form is clear because it is designed
 * for creating records only. If validations are used (follow ember-changeset-validations)
 * then user is allowed to submit form only when it fulfills criteria. After the
 * form is submitted, the form is closed.
 */
export default Ember.Component.extend({
  /**
   * Title for button that controls visibility of form
   *
   * @property visibilityTitle
   * @type {String}
   * @default ''
   * @public
   */
  visibilityTitle: '',

  /**
   * Title for submit button
   *
   * @property submitTitle
   * @type {String}
   * @default 'Submit'
   * @public
   */
  submitTitle: 'Submit',

  /**
   * Title for submit button
   *
   * @property titleSubmit
   * @type {Action}
   * @public
   */
  submitAction: undefined,

  /**
   * Form validations (resend to ember-changeset-validations)
   *
   * @property validations
   * @type {Object}
   * @public
   */
  validations: undefined,

  /**
   * Underlying object for ember-changeset
   *
   * @property _empty
   * @private
   */
  _empty: {},

  _isFormVisible: false,
});
