import Ember from 'ember';

export default Ember.Component.extend({
  containsSelf: Ember.computed('data.@each', {
    get() {
      if (this.get('data') === undefined) {
          return false;
      }

      return this.get('data').some((textField) => {
        if (! textField) {
          return false;
        }

        return textField.some((name) => {
          return (this.get('selfName') === name);
        });
      });
    }
  }),
});
