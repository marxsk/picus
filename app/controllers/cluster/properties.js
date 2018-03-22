import Ember from 'ember';
import BaseController from 'picus/controllers/base-controller';

export default BaseController.extend({
  notifications: Ember.inject.service('notifications'),
  queryParams: ['showAdvancedProperties'],
  showAdvancedProperties: false,

  actions: {
    submitProperties(properties, changesetForm) {
      // parse HTML form
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

      // prepare data structures
      const cluster = this.store.peekAll('cluster').objectAt(0);
      changeset.get('changes').forEach((attr) => {
        cluster.get('properties').addObject(this.get('store').createRecord('property', {
          name: attr.key,
          value: attr.value,
        }));
      });

      this.transitionToRoute('cluster.index');
      if (changeset.get('changes').length === 0) {
        return Ember.RSVP.resolve();
      }
      return this.get('notifications').notificationSaveRecord(cluster, 'UPDATE_PROPERTIES');
    },
  },
});
