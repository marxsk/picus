import Ember from 'ember';
import BaseRoute from 'picus/routes/base-route';

export default BaseRoute.extend({
  queryParams: {
    showAdvancedProperties: {
      as: 'advanced',
      replace: true,
    },
  },

  setupController(controller, model) {
    this._super(controller, model);
    // hide sidebar menu
    this.controllerFor('application').set('hideMainMenu', false);
  },

  model() {
    const staticCluster = this.store.peekRecord('cluster', 1);

    this._prepareEnumFields(staticCluster);

    return Ember.RSVP.hash({
      staticCluster: this.store.peekRecord('cluster', 1),
    });
  },

  /** In order to have 'default (default-value)' in select-field * */
  _prepareEnumFields(cluster) {
    cluster.get('properties').forEach((property) => {
      const e = property.get('enum');
      if (e !== undefined) {
        property.set('enum2', Ember.A());
        e.split(' ').forEach((enumItem) => {
          if (enumItem === 'default') {
            property.get('enum2').addObject({
              title: `${enumItem} (${property.get('default')})`,
              name: 'default',
            });
          } else {
            property.get('enum2').addObject({
              title: enumItem,
              name: enumItem,
            });
          }
        });
      }
    });
  },
});
