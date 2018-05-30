import Ember from 'ember';

export function isEmpty(params /* , hash */) {
  return Ember.isEmpty(params[0]);
}

export default Ember.Helper.helper(isEmpty);
