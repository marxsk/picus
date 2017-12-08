import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['filterString', 'advanced', 'internal'],
  filterString: '',
  advanced: false,
  internal: false,

  actions: {
    submitProperties(properties, changesetForm) {
      const changeset = changesetForm;
      changeset.get('change').forEach((attrName) => {
        properties.forEach((item) => {
          if (item.get('name') === attrName) {
            if (
              ['enum', 'boolean'].includes(item.get('type')) &&
              changeset.get('change')[attrName] === 'default'
            ) {
              // default has to be translated for an empty string for enum/booleans
              changeset.get('change')[attrName] = '';
            }
          }
        });
      });

      this.store.pushClusterProperties(changeset);
    },
    onSearch(search) {
      this.set('filterString', search);
      this.send('pageRefresh');
    },
    onAdvanced(value) {
      this.set('advanced', value);
      this.send('pageRefresh');
    },
    onInternal(value) {
      this.set('internal', value);
      this.send('pageRefresh');
    },
  },
});
