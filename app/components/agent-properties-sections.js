import Ember from 'ember';

/**
 * Component that generates single section (e.g. basic) of properties for fence/resource agents.
 *
 * It also generates all form fields that are required. Their types and values are obtained
 * from the metadata information.
 * */
export default Ember.Component.extend({
  /**
   * form is ember-form-for component to which we include generated form-fields
   *
   * @public
   */
  form: undefined,
  /**
   * filter is used for generating only fields which name contains 'filter' string
   *
   * @public
   */
  filter: undefined,
  /**
   * relevant part of agent's metadata
   *
   * @public
   * */
  parameters: undefined,
  /**
   * information about already filled changes in the form
   *
   * These information are not affected by filtering.
   *
   * @public
   */
  changeset: undefined,

  /**
   * This object is used only for showSecret() method
   *
   * @private
   */
  _formObject: undefined,

  actions: {
    showSecret(property, oldValue) {
      // In order to obtain current value from form, we need to do a work-around
      // If no-one touches the field -> return value from initializiation
      // If the field was modified -> (work-around) updateSecretLength is executed and
      // it sets us a formObject that cannot be accessed directly. And then a value is
      // obtained from the form property.

      let secret = '';
      if (this.get('_formObject') && this.get('_formObject').get(property) !== undefined) {
        secret = this.get('_formObject').get(property);
      } else {
        secret = oldValue;
      }

      alert(`The secret is '${secret}'`);
    },
    updateSecretLength(object, property, value) {
      this._formObject = object;
      Ember.set(object, property, value);
    },
  },
});
