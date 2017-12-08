import Ember from 'ember';

export function formatRunning(params) {
  return params[0] === true ? 'running' : 'stopped';
}

export default Ember.Helper.helper(formatRunning);
