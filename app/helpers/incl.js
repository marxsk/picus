import Ember from 'ember';

export function incl(params /* , hash */) {
  if (!params[1]) {
    return true;
  }
  if (!params[0]) {
    return true;
  }
  return params[0].includes(params[1]);
}

export default Ember.Helper.helper(incl);
