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
