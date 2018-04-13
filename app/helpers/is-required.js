import Ember from 'ember';

export function isRequired(params) {
  const validations = params[0];
  const name = params[1];

  const validationRules = validations[name];
  if (validationRules === undefined) {
    return false;
  }
  if (validationRules.length === 0) {
    return false;
  }

  // @todo: return true only when specific validators are used e.g. isBlank
  return true;
}

export default Ember.Helper.helper(isRequired);
