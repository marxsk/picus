import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['filterString'],
  filterString: '',

  actions: {
    submitProperties: function(properties, changeset) {
      // update values locally
      for (let attrName in changeset.get('change')) {
        properties.forEach(function(item, index) {
          if (item.get('name') === attrName) {
            item.set('value', changeset.get(attrName));
          }
        });
      }

      // save changes to remote server
      this.store.pushClusterProperties(changeset);
    },
    onSearch: function(search) {
      this.set('filterString', search);
      this.send('pageRefresh', search);
    },
  }
});
