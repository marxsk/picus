import Ember from 'ember';

export default Ember.Component.extend({
  containsSelf: Ember.computed('data.@each.value', {
    get() {
      if (this.get('data') === undefined) {
          return false;
      }

      return this.get('data').some((textField) => {
        return textField.get('value').some((name) => {
          return (this.get('selfName') === name);
        })
      })
    }
  }),
});
