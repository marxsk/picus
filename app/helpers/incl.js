import Ember from 'ember';

export function incl(params/*, hash*/) {
  if (!params[1]) {
    console.log('incl - 1');
    return true;
  }
  if (!params[0]) {
    console.log('incl - 2');
    return true;
  }
  return (params[0].includes(params[1]));
}

export default Ember.Helper.helper(incl);
