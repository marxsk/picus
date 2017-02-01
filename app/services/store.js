import DS from 'ember-data';
import Ember from 'ember';

export default DS.Store.extend({
  ajax: Ember.inject.service(),

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

    let prom = new Ember.RSVP.Promise(function(resolve) {
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
        ['node', 'fence', 'resource', 'attribute'].forEach(function(modelName) {
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
        resolve();
      }, function(error) {
        alert(error);
      });
    });

    return prom;
  },

  /** Push all cluster properties to server in one request **/
  pushClusterProperties: function(changeset) {
    let data = JSON.stringify({
      data: {
        type: 'properties',
        attributes: {
          ...changeset.get('change'),
        },
      }});

    this.get('ajax').patch('/properties', {data: data}).then(() => {
      this.reloadData();
    });
  },

  /** Push new node into cluster **/
  pushNewNode: function(changeset) {
    const newNode = this.createRecord('node',
    {
      name: changeset.nodeName
    });

    newNode.save().then(() => {
      this.reloadData();
    });
  },

  pushNewFence: function(attrs) {
    let properties = {};
    attrs.properties.forEach(function(o) { properties[o.key] = o.value; });
    delete properties['fenceName'];

    const data = JSON.stringify({
      data: {
        type: 'fence',
        attributes: {
          name: attrs.name,
          agentType: attrs.agentType,
          ...properties,
        },
      }});

    this.get('ajax').post('/fences', {data: data}).then(() => {
      this.reloadData();
    });
  },

  pushNewResource: function(attrs) {
    let properties = {};
    attrs.properties.forEach(function(o) { properties[o.key] = o.value; });
    delete properties['resourceName'];

    console.log(JSON.stringify(properties));
    console.log(JSON.stringify(attrs));

    const data = JSON.stringify({
      data: {
        type: 'resource',
        attributes: {
          name: attrs.name,
          agentProvider: attrs.agentProvider,
          agentType: attrs.agentType,
          ...properties,
        },
      }});

      console.log(data);

    this.get('ajax').post('/resources', {data: data}).then(() => {
      this.reloadData();
    });
  },

  pushUpdateFence: function(attrs) {
    let properties = {};
    attrs.properties.forEach(function(o) { properties[o.key] = o.value; });
    delete properties['fenceName'];

    const data = JSON.stringify({
      data: {
        type: 'fence',
        attributes: {
          id: attrs.id,
          ...properties,
        },
      }});

      this.get('ajax').patch('/fences', {data: data}).then(() => {
        this.reloadData();
      });
  },

  pushUpdateResource: function(attrs) {
    let properties = {};
    attrs.properties.forEach(function(o) { properties[o.key] = o.value; });
    delete properties['resourceName'];

    const data = JSON.stringify({
      data: {
        type: 'resource',
        attributes: {
          id: attrs.id,
          ...properties,
        },
      }});

      this.get('ajax').patch('/resources', {data: data}).then(() => {
        this.reloadData();
      });
  },

  /** Get available fence agents ; this info is not part of cluster overview **/
  getAvailableFenceAgents() {
    const _this = this;

    let prom = new Ember.RSVP.Promise(function(resolve) {
      _this.get('ajax').request('/remote/get_avail_fence_agents').then((response) => {
        resolve(response);
      });

    }, function(error) {
      alert(error);
    });

    return prom;
  },

  getAvailableResourceAgents() {
    const _this = this;

    let prom = new Ember.RSVP.Promise(function(resolve) {
      _this.get('ajax').request('/remote/get_avail_resource_agents').then((response) => {
        const agents = {};
        agents._providers = [];

        Object.keys(response).forEach((agent) => {
          const lastSemicolon = agent.lastIndexOf(':');

          const provider = agent.substring(0, lastSemicolon);
          const name = agent.substring(lastSemicolon + 1);

          if (! (provider in agents)) {
            agents._providers.push(provider);
            agents[provider] = [];
          }

          agents[provider].push(name);
        });

        resolve(agents);
      });
    }, function(error) {
      alert(error);
    });

    return prom;
  },

  getMetadataFenceAgent(agentName) {
    const _this = this;
    let prom = new Ember.RSVP.Promise(function(resolve) {
    _this.get('ajax').request(`/remote/fence-metadata/${agentName}`).then((response) => {
      resolve(response);
    });
    }, function(error) {
      alert(error);
    });

    return prom;
  },

  getMetadataResourceAgent(agentName) {
    const _this = this;
    let prom = new Ember.RSVP.Promise(function(resolve) {
    _this.get('ajax').request(`/remote/resource-metadata/${agentName}`).then((response) => {
      resolve(response);
    });
    }, function(error) {
      alert(error);
    });

    return prom;
  }
});
