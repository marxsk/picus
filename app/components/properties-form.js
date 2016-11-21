import Ember from 'ember';

export default Ember.Component.extend({
  filterString: '',
  showAdvanced: false,

  _triggerUrlRefresh(search) {
    this.attrs.onSearchRefresh(search);
  },

  actions: {
    toggleAdvanced() {
      this.toggleProperty('showAdvanced');
    },
    urlRefresh(search) {
      Ember.run.debounce(this, '_triggerUrlRefresh', search ,300);
    }
  },

  properties: null,
  simpleProperties: Ember.computed('properties.@each.value', {
    get() {
      let ret = {};
      this.get('properties').forEach(function(x) {
        ret[x.get('name')] = x.get('value');
      });
      return ret;
    }}),

  init() {
    this.properties = this.get('data');

    return this._super();
  }
});
