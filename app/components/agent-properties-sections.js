import Ember from 'ember';

export default Ember.Component.extend({
  formObject: undefined,

  actions: {
    showSecret(property, oldValue) {
        // In order to obtain current value from form, we need to do a work-around
        // If no-one touches the field -> return value from initializiation
        // If the field was modified -> (work-around) updateSecretLength is executed and
        // it sets us a formObject that cannot be accessed directly. And then a value is
        // obtained from the form property.

        let secret = '';
        if (this.get('formObject') && (this.get('formObject').get(property) !== undefined)) {
          secret = this.get('formObject').get(property);
        } else {
          secret = oldValue;
        }

        alert(`The secret is '${secret}'`);
    },
    updateSecretLength(object, property, value) {
      this.formObject = object;
      Ember.set(object, property, value);
    }
  }
});
