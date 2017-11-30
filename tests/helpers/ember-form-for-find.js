import Ember from 'ember';

export default Ember.Test.registerHelper('emberFormForFind',
  function(app, labelText) {
    let result = undefined;
    find('label.form-field--label').each((idx, label) => {
      if (label.innerText.trim() === labelText) {
        result = label.nextElementSibling;
      }
    });
    return result;
  }
);
