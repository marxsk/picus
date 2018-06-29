import Ember from 'ember';

export default Ember.Component.extend({
  containsSelf: Ember.computed('data.@each', {
    get() {
      if (this.get('data') === undefined) {
        return false;
      }

      console.log(this.get('data'));

      return this.get('data').some((obj) => {
        if (!obj.get('resources')) {
          return false;
        }

        console.log(obj);

        return textField.some(name => this.get('selfName') === name);
      });
    },
  }),
});
