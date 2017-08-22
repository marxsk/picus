import Ember from 'ember';

export default Ember.Component.extend({
  filterString: '',
  showAdvanced: false,
  showInternalNames: false,
  selectedInput: undefined,
  helpFor: '',

  _triggerUrlRefresh(search) {
    this.attrs.onSearchRefresh(search);
  },

  actions: {
    toggleAdvanced() {
      const result = this.toggleProperty('showAdvanced');
      this.attrs.onAdvancedAction(result);
    },
    toggleInternalNames() {
      const result = this.toggleProperty('showInternalNames');
      this.attrs.onInternalAction(result);
    },
    urlRefresh(search) {
      Ember.run.debounce(this, '_triggerUrlRefresh', search ,300);
    },
    setHelp(propertyName) {
      this.set('helpFor', `HELP FOR: ${propertyName}`);
      this.set('selectedInput', propertyName);
    }
  },

  properties: null,
  simpleProperties: Ember.computed('properties.@each.value', {
    get() {
      if (this.get('properties') === undefined) {
        return {};
      }
      let ret = {};
      this.get('properties').forEach(function(x) {
        ret[x.get('name')] = x.get('value');
      });
      return ret;
    }}),

  init() {
    this.properties = this.get('data');
    this.set('filterString', this.get('presetFilter'));

    return this._super();
  }
});
