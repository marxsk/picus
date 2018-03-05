import Ember from 'ember';

export default Ember.Route.extend({
  notifications: Ember.inject.service('notifications'),

  queryParams: {
    filterString: {
      as: 's',
      replace: true,
    },
    showInternalNames: {
      as: 'internal',
      replace: true,
    },
  },
});
