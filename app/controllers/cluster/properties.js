import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['filterString', 'advanced', 'internal'],
  filterString: '',
  advanced: false,
  internal: false,

  actions: {
    submitProperties: function(properties, changeset) {
      for (let attrName in changeset.get('change')) {
        properties.forEach(function(item) {
          if (item.get('name') === attrName) {
            if (['enum', 'boolean'].contains(item.get('type')) && (changeset.get('change')[attrName] === 'default')) {
                // default has to be translated for an empty string for enum/booleans
                changeset.get('change')[attrName] = '';
            }
          }
        });
      }

      this.store.pushClusterProperties(changeset);
    },
    onSearch: function(search) {
      this.set('filterString', search);
      this.send('pageRefresh');
    },
    onAdvanced: function(value) {
      this.set('advanced', value);
      this.send('pageRefresh');
    },
    onInternal: function(value) {
      this.set('internal', value);
      this.send('pageRefresh');
    }
  }
});
