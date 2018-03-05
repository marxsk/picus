import BaseRoute from 'picus/routes/base-route';

export default BaseRoute.extend({
  queryParams: {
    activeTab: {
      as: 'tab',
      replace: true,
    },
  },
});
