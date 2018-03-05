import Ember from 'ember';

export default Ember.Component.extend({
  filterString: '',
  showAdvanced: false,
  showInternalNames: false,
  selectedInput: undefined,
  helpFor: '',

  actions: {
    setHelp(propertyName) {
      this.set('helpFor', `HELP FOR: ${propertyName}`);
      this.set('selectedInput', propertyName);
    },
  },

  properties: null,
  simpleProperties: Ember.computed('properties.@each.value', {
    get() {
      if (this.get('properties') === undefined) {
        return {};
      }
      const ret = {};
      this.get('properties').forEach((x) => {
        ret[x.get('name')] = x.get('value');
      });
      return ret;
    },
  }),

  init() {
    this.properties = this.get('data');

    return this._super();
  },
});
