import Ember from 'ember';

export function formatRunning(status) {
  return ((status === true) ? 'running' : 'stopped');
}

export default Ember.Helper.helper(formatRunning);
