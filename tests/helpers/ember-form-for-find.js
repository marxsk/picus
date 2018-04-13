import Ember from 'ember';

export default Ember.Test.registerHelper('emberFormForFind', (app, labelText) => {
  let result;
  find('label.form-field--label').each((idx, label) => {
    if ((label.innerText.trim() === labelText) || (label.innerText.trim() === `${labelText} *`)) {
      result = label.nextElementSibling;
    }
  });
  return result;
});
