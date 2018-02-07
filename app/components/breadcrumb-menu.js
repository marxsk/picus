import Ember from 'ember';

export default Ember.Component.extend({
  routing: Ember.inject.service('-routing'),
  // @note: Keys are camelized because dots are used by Ember.get to obtain child key
  routeTitles: {
    clusterIndex: 'Home',
    clusterAcl: 'ACL',
    clusterFences: 'Fence Devices',
    clusterResources: 'Resources',
  },
});
