import DS from 'ember-data';
import Ember from 'ember';

const { RSVP } = Ember;

function _jsonToQueryString(json) {
    return Object.keys(json).map(function(key) {
            return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
        }).join('&');
}

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

  updateRecord(store, type, snapshot) {
    let data = undefined;
    let url = this.get('namespace') + '/';

    if (snapshot.modelName === 'acl-role') {
      if (snapshot.hasMany('users').length < snapshot.record.savedTrackerValue('users').length) {
        // remove existing relation
        const deletedUserId = snapshot.record.savedTrackerValue('users').filter((obj) => {
          return !(snapshot.hasMany('users').some((o) => {
            if (obj === o.id) {
              return true;
            } else {
              return false;
            }
          }))
        });

        url = url + 'remove_acl';
        data = {
          item: 'usergroup',
          item_type: 'user',
          role_id: snapshot.record.get('name'),
          usergroup_id: store.peekRecord('acl-user', deletedUserId[0]).get('name'),
        };
        data = _jsonToQueryString(data);
      } else if (snapshot.hasMany('users').length > snapshot.record.savedTrackerValue('users').length) {
        // add new relation
        snapshot.hasMany('users').forEach((user) => {
          // @note: UI currently allows only single change at one click
          const changes = user.changedAttributes();

          if (Object.keys(changes).length === 0) {
            return;
          } else if (('name' in changes) && (changes.name[0] === undefined)) {
            url = url + 'add_acl';

            data = {
              item: 'user',
              role_id: snapshot.record.get('name'),
              usergroup: changes.name[1],
            }

            data = _jsonToQueryString(data)
          } else {
            Ember.Logger.error('[adapter] Only change in "users.name" is expected for acl-role');
          }
        });
      } else if (snapshot.hasMany('groups').length < snapshot.record.savedTrackerValue('groups').length) {
        // remove existing relation
        const deletedUserId = snapshot.record.savedTrackerValue('groups').filter((obj) => {
          return !(snapshot.hasMany('groups').some((o) => {
            if (obj === o.id) {
              return true;
            } else {
              return false;
            }
          }))
        });

        url = url + 'remove_acl';
        data = {
          item: 'usergroup',
          item_type: 'group',
          role_id: snapshot.record.get('name'),
          usergroup_id: store.peekRecord('acl-user', deletedUserId[0]).get('name'),
        };
        data = _jsonToQueryString(data);
      } else if (snapshot.hasMany('groups').length > snapshot.record.savedTrackerValue('groups').length) {
        // add new relation
        snapshot.hasMany('groups').forEach((user) => {
          // @note: UI currently allows only single change at one click
          const changes = user.changedAttributes();

          if (Object.keys(changes).length === 0) {
            return;
          } else if (('name' in changes) && (changes.name[0] === undefined)) {
            url = url + 'add_acl';

            data = {
              item: 'group',
              role_id: snapshot.record.get('name'),
              usergroup: changes.name[1],
            }

            data = _jsonToQueryString(data)
          } else {
            Ember.Logger.error('[adapter] Only change in "users.name" is expected for acl-role');
          }
        });
      }
    }

    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.$.ajax({
        type: 'POST',
        url,
        dataType: 'text',
        data: data,
      }).then((response) => {
        Ember.Logger.assert(response !== "{}", `Response to updateRecord() for ${snapshot.modelName} was empty, it has to include id of saved record`);
        // @todo: start handling of response from cluster
        // @todo: perhaps await store.reloadData()
        store.reloadData();

        // We need to manually disconnect children objects created
        // on backend as they won't be updated automatically
        if (snapshot.modelName === 'constraint-set') {
          snapshot.record.set('resourceSets', Ember.A());
        } else if (snapshot.modelName == 'acl-role') {
          // @todo: this might show invalid state (for short-moment) when we are adding multiple users/groups fast enough
          snapshot.record.set('users', Ember.A());
          snapshot.record.set('groups', Ember.A());
        }

        Ember.run(null, resolve, JSON.parse(response));
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
