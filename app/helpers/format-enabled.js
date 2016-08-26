import Ember from 'ember';

export function formatEnabled(status) {
  return ((status === true) ? 'enabled' : 'disabled');
}

export default Ember.Helper.helper(formatEnabled);
