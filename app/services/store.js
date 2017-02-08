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

  /**
   * Push new agent with basic configuration to pcsd
   * We distinguish two categories of 'properties'. There are first-class ones
   * e.g. name of agent, that are defined in model and dynamic ones. Backend does
   * not have to have same classification.
   *
   *  @param {string} agentType - Type of agent (resource|fence)
   *  @param {Object[]} attrs - Array of objects with properties ({key: FIELD, value: VALUE})
   *  @param {string[]} propsToDelete - Remove property names before pushing to backend
   *
   *  @todo Create proper error handlers
   *  @todo Method should return promise?
   **/
  pushNewAgent: function(agentType, attrs, propsToDelete = []) {
    let url = '';

    switch (agentType) {
      case 'resource':
        url += '/resources';
        break;
      case 'fence':
        url += '/fences';
        break;
      default:
        url = undefined;
    }

    console.assert((typeof url !== 'undefined'), `Invalid agentType (${agentType}) entered`);

    let properties = {};
    attrs.properties.forEach(function(o) { properties[o.key] = o.value; });

    const mainAttributes = Object.assign({}, attrs);
    delete mainAttributes['properties'];

    Object.keys(properties).forEach((key) => {
      if (propsToDelete.indexOf(key) >= 0) {
        delete properties[key];
      }
    });

    const data = JSON.stringify({
      data: {
        type: agentType,
        attributes: {
          ...mainAttributes,
          ...properties,
        },
      }});

    this.get('ajax').post(url, {data: data}).then(() => {
      this.reloadData();
    });
  },

  /**
   * Push update of agent (dynamic) properties to pcsd
   *
   *  @param {string} agentType - Type of agent (resource|fence)
   *  @param {Object[]} attrs - Array of objects with properties ({key: FIELD, value: VALUE})
   *
   *  @todo Create proper error handlers
   *  @todo Method should return promise?
   **/
  pushUpdateAgentProperties: function(agentType, attrs) {
    let url = '';

    switch (agentType) {
      case 'resource':
        url += '/resources';
        break;
      case 'fence':
        url += '/fences';
        break;
      default:
        url = undefined;
    }

    console.assert((typeof url !== 'undefined'), `Invalid agentType (${agentType}) entered`);

    let properties = {};
    attrs.properties.forEach(function(o) { properties[o.key] = o.value; });

    const data = JSON.stringify({
      data: {
        type: agentType,
        attributes: {
          id: attrs.id,
          ...properties,
        },
      }});

      this.get('ajax').patch(url, {data: data}).then(() => {
        this.reloadData();
      });
  },

  /**
   * Download a list of installed agents from pcsd
   *
   *  @param {string} agentType - Type of agent (resource|fence)
   *  @return {Object} Object that have providers as a key and under the key is stored with
   *    array of available agents. If the provider name is not defined then undefinedProvider
   *    is used as the provider name.
   *
   *  @todo Additional item _providers is contained in the result because it is useful
   *    in the templates. This may (should) be replaced by template handlebar that will
   *    do Object.keys(result).
   *  @todo Create proper error handlers
   **/
  getAvailableAgents(agentType) {
    let url = '/remote';

    switch (agentType) {
      case 'resource':
        url += '/get_avail_resource_agents';
        break;
      case 'fence':
        url += '/get_avail_fence_agents';
        break;
      default:
        url = undefined;
    }

    console.assert((typeof url !== 'undefined'), `Invalid agentType (${agentType}) entered`);

    const _this = this;
    return new Ember.RSVP.Promise(function(resolve) {
      _this.get('ajax').request(url).then((response) => {
        const agents = {};
        agents._providers = [];

        Object.keys(response).forEach((agent) => {
          const lastSemicolon = agent.lastIndexOf(':');
          let provider = agent.substring(0, lastSemicolon);
          provider = (provider === '') ? 'undefinedProvider' : provider;
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
  },

  /**
   * Download XML metadata that describes agent from pcsd
   *  @param {string} agentType - Type of agent (resource|fence)
   *  @param {string} agentName - Agent name without class/provider prefix
   *
   *  @todo Create proper error handlers
   */
  getAgentMetadata(agentType, agentName) {
    let url = '/remote';

    switch (agentType) {
      case 'resource':
        url += '/resource-metadata';
        break;
      case 'fence':
        url += '/fence-metadata';
        break;
      default:
        url = undefined;
    }

    console.assert((typeof url !== 'undefined'), `Invalid agentType (${agentType}) entered`);

    const _this = this;
    return new Ember.RSVP.Promise(function(resolve) {
      _this.get('ajax').request(`${url}/${agentName}`).then((response) => {
        resolve(response);
      });
    }, function(error) {
      alert(error);
    });
  },

  pushAppendMetaAttribute(resourceId, attribute) {
    const _this = this;
    return new Ember.RSVP.Promise(function(resolve) {
      const data = JSON.stringify({
        data: {
          type: 'meta-attribute',
          attributes: {
            resource: resourceId,
            ...attribute
          },
        }});

      _this.get('ajax').post('/meta/', {data: data}).then((response) => {
        _this.reloadData();
        resolve(response);
      })
    }, function(error) {

    });
  },
  pushAppendLocationPreference(resourceId, attribute) {
    const _this = this;
    return new Ember.RSVP.Promise(function(resolve) {
      const data = JSON.stringify({
        data: {
          type: 'location-preference',
          attributes: {
            resource: resourceId,
            ...attribute
          },
        }});

      _this.get('ajax').post('/location-preference/', {data: data}).then((response) => {
        _this.reloadData();
        resolve(response);
      })
    }, function(error) {

    });
  },
  pushAppendOrderingPreference(resourceId, attribute) {
    const _this = this;
    return new Ember.RSVP.Promise(function(resolve) {
      const data = JSON.stringify({
        data: {
          type: 'ordering-preference',
          attributes: {
            resource: resourceId,
            ...attribute
          },
        }});

      _this.get('ajax').post('/ordering-preference/', {data: data}).then((response) => {
        _this.reloadData();
        resolve(response);
      })
    }, function(error) {

    });
  }

});
