import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    activeTab: {
      as: 'tab',
      replace: true,
    },
  },
});
