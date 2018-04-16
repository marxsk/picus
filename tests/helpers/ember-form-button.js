import Ember from 'ember';

export default Ember.Test.registerHelper('emberFormButton', (app, labelText) => {
  let result;

  find('button.form-button--submit').each((idx, button) => {
    if (button.innerText.trim() === labelText) {
      result = button;
    }
  });

  find('div.save-button button').each((idx, button) => {
    if (button.innerText.trim() === labelText) {
      result = button;
    }
  });

  if (result === undefined) {
    Ember.Logger.warn(`Unable to find button with label: ${labelText}`);
  }
  return result;
});
