import Ember from 'ember';

export function formatEnabled(params) {
  return params[0] === true ? 'enabled' : 'disabled';
}

export default Ember.Helper.helper(formatEnabled);
