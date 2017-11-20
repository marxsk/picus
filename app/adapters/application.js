import DS from 'ember-data';
import Ember from 'ember';

const { RSVP } = Ember;

export default DS.Adapter.extend({
  namespace: undefined,

  pathForType: function(modelName, action) {
    let resultURL;

    if (action === 'delete') {
      resultURL = {
        'location-preference': 'remove_constraint_remote',
        'colocation-preference': 'remove_constraint_remote',
        'ordering-preference': 'remove_constraint_remote',
        'ticket-preference': 'remove_constraint_remote',
        'attribute': 'add_meta_attr_remote',
        'utilization-attribute': 'set_resource_utilization',
        'constraint-set': 'remove_constraint_remote',
        'acl-role': 'remove_acl_roles',
        'acl-permission': 'remove_acl',
      }[modelName];
    } else if (action === 'create') {
      resultURL = {
        'location-preference': 'add_constraint_remote',
        'colocation-preference': 'add_constraint_remote',
        'ordering-preference': 'add_constraint_remote',
        'ticket-preference': 'add_constraint_remote',
        'attribute': 'add_meta_attr_remote',
        'utilization-attribute': 'set_resource_utilization',
        'constraint-set': 'add_constraint_set_remote',
        'acl-role': 'add_acl_role',
        'acl-permission': 'add_acl',
      }[modelName];
    }

    if (resultURL === undefined) {
      Ember.Logger.error(`[adapter] model ${modelName} for ${action} has no endpoint definition`);
    }

    return resultURL;
  },

  createRecord(store, type, snapshot) {
    const data = this.serialize(snapshot, {action: 'create'});
    const url = this.get('namespace') + '/' + this.pathForType(snapshot.modelName, 'create');

    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.$.ajax({
        type: 'POST',
        url,
        dataType: 'text',
        data: data,
      }).then((response) => {
        Ember.Logger.assert(response !== "{}", `Response to createRecord() for ${snapshot.modelName} was empty, it has to include id of saved record`);
        // @todo: start handling of response from cluster
        // @todo: perhaps await store.reloadData()
        store.reloadData();

        if (snapshot.modelName === 'constraint-set') {
          // We need to manually disconnect resource sets with null id
          // as they won't be updated automatically
          snapshot.record.set('resourceSets', Ember.A());
        }

        Ember.run(null, resolve, JSON.parse(response));
      }, (jqXHR) => {
        // @todo: this is completely broken
        jqXHR.then = null; // copied from official documentation
        Ember.run(null, reject, jqXHR);
      });
    });
  },

  deleteRecord(store, type, snapshot) {
    const data = this.serialize(snapshot, {action: 'delete'});
    const url = this.get('namespace') + '/' + this.pathForType(snapshot.modelName, 'delete');

    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.$.ajax({
        type: 'POST',
        url,
        dataType: 'text',
        data: data,
      }).then((response) => {
        // @todo: start handling of response from cluster
        // @todo: perhaps await store.reloadData()
        store.reloadData();
        Ember.run(null, resolve, { errors: [ { status: 202, }, ] });
      }, (jqXHR) => {
        // @todo: this is completely broken
        jqXHR.then = null; // copied from official documentation
        Ember.run(null, reject, jqXHR);
      });
    });
  },

  reloadData: function(clusterName) {
    const options = {
      type: 'GET',
    };

    if (clusterName) {
      this.set('namespace', `/managec/${clusterName}`);
    }
    options.url = this.get('namespace') + '/cluster_status';

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
