import Ember from 'ember';

/**
 * Component that executes user defined action when double-clicked.
 */
export default Ember.Component.extend({
  action: undefined,

  doubleClick() {
    this.get('action')(this.get('content'));
  },
});
