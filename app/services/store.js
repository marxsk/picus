import DS from 'ember-data';
import Ember from 'ember';

export default DS.Store.extend({
  /** Reload all data from backend

  Traditionally, Store works on more standard API so we can ask for specific
  types with findAll(type) methods. In case of pcsd, we have just one single
  endpoint that returns complete store after one request. Method that reloads
  data belongs to Adapter class but we want to access it also from the standard
  code.

  **/
  reloadData: function() {
    const res = this.retrieveManagedInstance('adapter', 'application').reloadData();
    const ser = this.retrieveManagedInstance('serializer', 'application');
    const store = this;

    res.then(function(response) {
      var modelClass = store.modelFor('cluster');
      var normalized = ser.normalizeSingleResponse(store, modelClass, response);

      const generateId = function(json, parent) {
        return Ember.get(json, parent + 'type') + '::' + Ember.get(json, parent + 'id');
      };

      if (generateId(normalized, 'data.0.') === 'undefined::undefined') {
        // response does not contain relevant data, we should skip the processing
        // @todo: error/warning?
        return;
      }

      const knownIds = Ember.A();
      // add ID of cluster itself - we are working with just one cluster in response
      knownIds.addObject(generateId(normalized, 'data.0.'));

      // add information of all objects that are included with cluster response
      if (Ember.get(normalized, 'included') !== undefined) {
        Ember.get(normalized, 'included').forEach(function(item) {
          knownIds.addObject(generateId(item, ''));
        });
      }

      // remove records which no longer exists on backend from store for every used model
      ['node', 'resource', 'attribute'].forEach(function(modelName) {
          store.peekAll(modelName).forEach(function(item) {
            if (!knownIds.contains(modelName + '::' + item.get('id'))) {
              item.deleteRecord();
            } else {
              // reset flags (isDeleted,...) to 'clean' state
              item.rollbackAttributes();
            }
          });
      });

      store.push(normalized);
    }, function(error) {
      alert(error);
    });
    return;
  }
});
