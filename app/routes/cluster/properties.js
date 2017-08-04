import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend({
  queryParams: {
    filterString: {
      as: 's',
      replace: true
    }
  },
  actions: {
    pageRefresh() {
      this.refresh();
    }
  },

  setupController(controller, model) {
    this._super(controller, model);
    // hide sidebar menu
    this.controllerFor('application').set('hideMainMenu', false);
   },

  model({filterString, advanced}) {
    const advancedBoolean = advanced ? true : false;
    const staticCluster = this.store.peekRecord('cluster', 1);

    this._prepareEnumFields(staticCluster);

    return Ember.RSVP.hash({
      filterProperties: filterString,
      showAdvanced: advancedBoolean,
      staticCluster: this.store.peekRecord('cluster', 1),
    });
  },

  /** In order to have 'default (default-value)' in select-field **/
  _prepareEnumFields(cluster) {
    cluster.get('properties').forEach(function(property) {
      const e = property.get('enum');
      if (e !== undefined) {
        property.set('enum2', Ember.A());
        e.split(' ').forEach((enumItem) => {
          if (enumItem === "default") {
            property.get('enum2').addObject({
              title: (enumItem + ' (' + property.get('default') + ')'),
              name: 'default'
            });
          } else {
            property.get('enum2').addObject({
              title: enumItem,
              name: enumItem
            });
          }
        });
      }
    });
  }
});
