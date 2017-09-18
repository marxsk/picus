import Ember from 'ember';

export default Ember.Component.extend({
  src: undefined,
  key: undefined,
  elementPrefix: 'dynamic',

  /**
   * The original idea was to use 'source' as the basis for changes.
   * What is good idea but as we work with undefined value, we want
   * to do initialization inside so address is changed. That is a reason
   * to split it into 'src' and 'key' what offers us initialization without
   * changing address of 'src'.
   */
  init() {
      this._super(...arguments);
      if (!(this.get('key') in this.get('src'))) {
        Ember.Logger.debug('dynamic-fields: Source was undefined, creating the array with empty item');
        this.set('source', Ember.A());
        this.get('src').set(this.get('key'), this.get('source'));
        this.get('source').pushObject(Ember.Object.create({
          name: `${this.get('elementPrefix')}_0`,
          value: '',
        }));
      }
  },

  actions: {
    update: function(target, objectName, value) {
      const re = /(?:_([^_]+))?$/;
      const lastIndex = parseInt(re.exec(this.get('source.lastObject.name'))[1]);
      const currentIndex = parseInt(re.exec(objectName)[1]);

      if (`${this.get('elementPrefix')}_${lastIndex}` === objectName) {
        Ember.Logger.debug('dynamic-fields: Adding new field');
        this.get('source').pushObject(Ember.Object.create({name: `${this.get('elementPrefix')}_${1 + lastIndex}`, value: ''}));
      } else if ((value === undefined) || (value.length === 0)) {
        Ember.Logger.debug('dynamic-fields: Removing field');
        this.get('source').removeAt(currentIndex);
      }
    }
  }
});
