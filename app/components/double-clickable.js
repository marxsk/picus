import Ember from 'ember';

export default Ember.Component.extend({
  doubleClick() {
    this.get('action')(this.get('content'));
  }
});
