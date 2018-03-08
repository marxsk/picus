import BaseController from 'picus/controllers/base-controller';

export default BaseController.extend({
  queryParams: ['showAdvancedProperties'],
  showAdvancedProperties: false,

  actions: {
    submitProperties(properties, changesetForm) {
      const changeset = changesetForm;
      changeset.get('changes').forEach((attrName) => {
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

      // @todo: replace with proper save + notification
      return this.store.pushClusterProperties(changeset);
    },
    toggleAdvancedProperties(v) {
      this.toggleProperty('showAdvancedProperties');
    },
  },
});
