import DS from 'ember-data';
import Ember from 'ember';

const { RSVP } = Ember;

function _jsonToQueryString(json) {
  return Object.keys(json)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`)
    .join('&');
}

export default DS.Adapter.extend({
  namespace: undefined,

  pathForType(modelName, action) {
    let resultURL;

    if (action === 'delete') {
      resultURL = {
        'location-preference': 'remove_constraint_remote',
        'colocation-preference': 'remove_constraint_remote',
        'ordering-preference': 'remove_constraint_remote',
        'ticket-preference': 'remove_constraint_remote',
        'resource-attribute': 'add_meta_attr_remote',
        'resource-utilization-attribute': 'set_resource_utilization',
        'constraint-set': 'remove_constraint_remote',
        'acl-role': 'remove_acl_roles',
        'acl-permission': 'remove_acl',
        resource: 'remove_resource',
        fence: 'remove_resource',
        'node-attribute': 'add_node_attr_remote',
        'node-utilization-attribute': 'set_node_utilization',
      }[modelName];
    } else if (action === 'create') {
      resultURL = {
        'location-preference': 'add_constraint_remote',
        'colocation-preference': 'add_constraint_remote',
        'ordering-preference': 'add_constraint_remote',
        'ticket-preference': 'add_constraint_remote',
        'resource-attribute': 'add_meta_attr_remote',
        'resource-utilization-attribute': 'set_resource_utilization',
        'constraint-set': 'add_constraint_set_remote',
        'acl-role': 'add_acl_role',
        'acl-permission': 'add_acl',
        resource: 'update_resource',
        fence: 'update_fence_device',
        'node-attribute': 'add_node_attr_remote',
        'node-utilization-attribute': 'set_node_utilization',
      }[modelName];
    } else if (action === 'update') {
      resultURL = {
        resource: 'update_resource',
        fence: 'update_fence_device',
        cluster: 'update_cluster_settings',
      }[modelName];
    }

    if (resultURL === undefined) {
      Ember.Logger.error(`[adapter] model ${modelName} for ${action} has no endpoint definition`);
    }

    return resultURL;
  },

  createRecord(store, type, snapshot) {
    const data = this.serialize(snapshot, { action: 'create' });
    const url = `${this.get('namespace')}/${this.pathForType(snapshot.modelName, 'create')}`;

    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.$.ajax({
        type: 'POST',
        url,
        dataType: 'text',
        data,
      }).then(
        (response) => {
          Ember.Logger.assert(
            response !== '{}',
            `Response to createRecord() for ${
              snapshot.modelName
            } was empty, it has to include id of saved record`,
          );
          // @todo: start handling of response from cluster
          // @todo: perhaps await store.reloadData()
          store.reloadData();

          if (snapshot.modelName === 'constraint-set') {
            // We need to manually disconnect resource sets with null id
            // as they won't be updated automatically
            snapshot.record.set('resourceSets', Ember.A());
          }

          Ember.run(null, resolve, JSON.parse(response));
        },
        (jqXHR) => {
          // @todo: this is completely broken
          const xhr = jqXHR;
          xhr.then = null; // copied from official documentation
          Ember.run(null, reject, xhr);
        },
      );
    });
  },

  deleteRecord(store, type, snapshot) {
    const data = this.serialize(snapshot, { action: 'delete' });
    const url = `${this.get('namespace')}/${this.pathForType(snapshot.modelName, 'delete')}`;

    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.$.ajax({
        type: 'POST',
        url,
        dataType: 'text',
        data,
      }).then(
        (response) => {
          // @todo: start handling of response from cluster
          // @todo: perhaps await store.reloadData()
          store.reloadData();
          Ember.run(null, resolve, { errors: [{ status: 202 }] });
        },
        (jqXHR) => {
          // @todo: this is completely broken
          const xhr = jqXHR;
          xhr.then = null; // copied from official documentation
          Ember.run(null, reject, xhr);
        },
      );
    });
  },

  _updateAclElement(store, type, snapshot, fkName) {
    if (snapshot.hasMany(fkName).length < snapshot.record.savedTrackerValue(fkName).length) {
      const deletedElementId = snapshot.record
        .savedTrackerValue(fkName)
        .filter(obj => !snapshot.hasMany(fkName).some(o => obj === o.id));

      return {
        action: 'relation-removed',
        elementId: deletedElementId,
      };
    } else if (snapshot.hasMany(fkName).length > snapshot.record.savedTrackerValue(fkName).length) {
      // add new relation
      let result;

      snapshot.hasMany(fkName).some((user) => {
        // @note: UI currently allows only single change at one click
        const changes = user.changedAttributes();

        if (Object.keys(changes).length === 0) {
          return false;
        } else if ('name' in changes && changes.name[0] === undefined) {
          result = {
            action: 'relation-added',
            elementId: changes.name[1],
          };
          return true;
        }
        Ember.Logger.error('[adapter] Only change in "users.name" is expected for acl-role');
        return false;
      });
      if (result) {
        return result;
      }
      return {};
    }
    return {};
  },

  updateRecord(store, type, snapshot) {
    let jsonData;
    let data;
    const baseURL = `${this.get('namespace')}`;
    let url;

    if (snapshot.modelName === 'acl-role') {
      const userResponse = this._updateAclElement(store, type, snapshot, 'users');
      const groupResponse = this._updateAclElement(store, type, snapshot, 'groups');

      if (userResponse !== undefined) {
        if (userResponse.action === 'relation-removed') {
          url = `${baseURL}/remove_acl`;
          jsonData = {
            item: 'usergroup',
            item_type: 'user',
            role_id: snapshot.record.get('name'),
            usergroup_id: store.peekRecord('acl-user', userResponse.elementId).get('name'),
          };
        } else if (userResponse.action === 'relation-added') {
          url = `${baseURL}/add_acl`;
          jsonData = {
            item: 'user',
            role_id: snapshot.record.get('name'),
            usergroup: userResponse.elementId,
          };
        }
      }

      if (groupResponse !== undefined) {
        if (groupResponse.action === 'relation-removed') {
          url = `${baseURL}/remove_acl`;
          jsonData = {
            item: 'usergroup',
            item_type: 'group',
            role_id: snapshot.record.get('name'),
            usergroup_id: store.peekRecord('acl-group', groupResponse.elementId).get('name'),
          };
        } else if (groupResponse.action === 'relation-added') {
          url = `${baseURL}/add_acl`;
          jsonData = {
            item: 'group',
            role_id: snapshot.record.get('name'),
            usergroup: groupResponse.elementId,
          };
        }
      }
      data = _jsonToQueryString(jsonData);
    } else if (['resource', 'fence', 'cluster'].includes(snapshot.modelName)) {
      url = `${baseURL}/${this.pathForType(snapshot.modelName, 'update')}`;
      data = this.serialize(snapshot, { action: 'update' });
    } else {
      Ember.Logger.error(`[adapter] Changes in "${snapshot.modelName}" model are not expected`);
    }

    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.$.ajax({
        type: 'POST',
        url,
        dataType: 'text',
        data,
      }).then(
        (response) => {
          Ember.Logger.assert(
            response !== '{}',
            `Response to updateRecord() for ${
              snapshot.modelName
            } was empty, it has to include id of saved record`,
          );
          // @todo: start handling of response from cluster
          // @todo: perhaps await store.reloadData()
          store.reloadData();

          // We need to manually disconnect children objects created
          // on backend as they won't be updated automatically
          if (snapshot.modelName === 'constraint-set') {
            snapshot.record.set('resourceSets', Ember.A());
          } else if (snapshot.modelName === 'acl-role') {
            // @todo: this might show invalid state (for short-moment) when
            // we are adding multiple users/groups fast enough
            snapshot.record.set('users', Ember.A());
            snapshot.record.set('groups', Ember.A());
          }

          Ember.run(null, resolve, JSON.parse(response));
        },
        (jqXHR) => {
          // @todo: this is completely broken
          const xhr = jqXHR;
          xhr.then = null; // copied from official documentation
          Ember.run(null, reject, jqXHR);
        },
      );
    });
  },

  reloadData(clusterName) {
    const options = {
      type: 'GET',
    };

    if (clusterName) {
      this.set('namespace', `/managec/${clusterName}`);
    }
    options.url = `${this.get('namespace')}/cluster_status`;

    return new RSVP.Promise((resolve, reject) => {
      Ember.$.ajax(options).then(
        (response) => {
          resolve(response);
        },
        (xhr) => {
          reject(xhr);
        },
      );
    });
  },
});
