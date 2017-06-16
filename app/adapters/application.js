import JSONAPIAdapter from 'ember-data/adapters/json-api';
import Ember from 'ember';

const { RSVP } = Ember;

export default JSONAPIAdapter.extend({
  reloadData: function(clusterName) {
    let options = {
      type: 'GET',
      url: `/managec/${clusterName}/cluster_status`
    };

    return new RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax(options).then(
        function(response) {
          resolve(response);
        }, function(xhr) {
          reject(xhr);
        }
      );
    });
  },
});
