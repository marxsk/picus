import DS from 'ember-data';
import Ember from 'ember';

function _jsonToQueryString(json) {
    return Object.keys(json).map(function(key) {
            return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
        }).join('&');
}

export default DS.Store.extend({
  ajax: Ember.inject.service(),
  clusterName: 'my',

  /**
    Inject current time as a property

    Ticktock allows us to make computed properties based on current time.

    @property ticktock
  */
  ticktock: Ember.inject.service(),

  /**
    Unix timestamp of time when validity of data will expire.

    @property expiresAt
    @type Integer
    @default 0 Initial data are always invalid
  */
  expiresAt: 0,

  /**
    Duration (in ms) of validity of loaded data

    @property validityTime
    @type Integer
    @default 5000 -> 5 seconds
    @public
  /* how long we wait until next upload in ms */
  validityTime: 500 * 1000,

  /**
    Boolean to check if data are expired (true) or valid (false)

    @property isExpired
    @type Boolean
    @public
  */
  isExpired: Ember.computed('expiresAt', 'ticktock.now', function() {
    return this.get('expiresAt') < this.get('ticktock.now');
  }),

  /**
    Boolean to check if we are currrently doing a query

    @property isQueryInProgress
    @type Boolean
    @private
  */
  isQueryInProgress: false,

  /**
    Boolean to check if there is another request in queue that should be
    executed after finishing current request
  */
  isQueryInQueue: false,

  /**
    Init function

    We need to obtain computed property isExpired to start a loop
    for _reloader(). Otherwise _reloader() will start work only after
    first reloadData(). This is due to optimalisations for unused properties.

    @method init
  */
  init: function() {
    this.get('isExpired');
    return this._super();
  },

  /**
    Reload data if they have expired

    @method _reloader
  */
  _reloader: function() {
    if (this.get('isExpired')) {
      this.reloadData();
    }
  }.observes('ticktock.now', 'isExpired'),

  /** Reload all data from backend

  Traditionally, Store works on more standard API so we can ask for specific
  types with findAll(type) methods. In case of pcsd, we have just one single
  endpoint that returns complete store after one request. Method that reloads
  data belongs to Adapter class but we want to access it also from the standard
  code.

  **/
  reloadData: function() {
    var time = new Date();
    if (this.get('isQueryInProgress')) {
      this.set('isQueryInQueue', true);
      return;
    }

    this.set('isQueryInProgress', true);
    this.set('isQueryInQueue', false);
    this.set('expiresAt', this.get('ticktock.now') + this.get('validityTime'));

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
        store.set('isQueryInProgress', false);
        if (store.get('isQueryInQueue')) {
          store.reloadData();
        }
        resolve();
      }, function(error) {
        alert(error);
        store.set('isQueryInProgress', false);
        if (store.get('isQueryInQueue')) {
          store.reloadData();
        }
      });
    });

    return prom;
  },

  /** Push all cluster properties to server in one request **/
  pushClusterProperties: function(changeset) {
    // @todo: data has to be converted to the right format; send all vs changes? [+ default = null]
    this._sendData('update_cluster_settings', changeset.get('change'));
  },

  /** Push new node into cluster **/
  // @todo: move to standard API
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
   * Push create/update agent (dynamic) properties to pcsd
   *
   *  @param {string} agentType - Type of agent (resource|fence)
   *  @param {Object[]} attrs - Array of objects with properties ({key: FIELD, value: VALUE})
   *  @param {string} operation - (create|update)
   *
   *  @todo Create proper error handlers
   *  @todo Method should return promise?
   **/
  pushUpdateAgentProperties: function(agentType, attrs, operation = 'update') {
    let url = '/managec/' + this.get('clusterName') + '/update_';
    let transformedAgentType;

    switch (agentType) {
      case 'resource':
        url += 'resource';
        transformedAgentType = attrs.agentProvider + ':' + attrs.agentType;
        break;
      case 'fence':
        url += 'fence_device';
        transformedAgentType = attrs.agentType;
        break;
      default:
        url = undefined;
    }

    console.assert((typeof url !== 'undefined'), `Invalid agentType (${agentType}) entered`);

    // @todo: proper encoding (URIEncode?)
    let data = `resource_type=${transformedAgentType}`;
    if (operation === 'update') {
      data += `&resource_id=${attrs.name}`;
    }

    if (attrs.clone) {
      data += '&resource_clone=on';
      attrs.properties = attrs.properties.filter(function( obj ) {
          return obj.key !== 'clone';
      });
    }

    if (attrs.masterslave) {
      data += '&resource_ms=on';
      attrs.properties = attrs.properties.filter(function( obj ) {
          return obj.key !== 'masterslave';
      });
    }

    attrs.properties.forEach(function(o) { data += `&_res_paramne_${o.key}=${o.value}` });

    this.get('ajax').post(url, {data: data}).then(() => {
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

    return new Ember.RSVP.Promise((resolve) => {
      this.get('ajax').request(url).then((response) => {
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
    let url = '/managec/' + this.get('clusterName');

    switch (agentType) {
      case 'resource':
        url += '/get_resource_agent_metadata';
        break;
      case 'fence':
        url += '/get_fence_agent_metadata';
        break;
      default:
        url = undefined;
    }

    console.assert((typeof url !== 'undefined'), `Invalid agentType (${agentType}) entered`);

    return new Ember.RSVP.Promise((resolve) => {
      this.get('ajax').request(url, {data: {agent: agentName}}).then((response) => {
        resolve(response);
      });
    }, (error) => {
      alert(error);
    });
  },

  pushAppendMetaAttribute(resourceId, attribute) {
    return new Ember.RSVP.Promise((resolve) => {
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
    }, (error) => {

    });
  },
  pushAppendLocationPreference(resourceId, attribute) {
    return new Ember.RSVP.Promise((resolve) => {
      const data = JSON.stringify({
        data: {
          type: 'location-preference',
          attributes: {
            resource: resourceId,
            ...attribute
          },
        }});

      this.get('ajax').post('/location-preference/', {data: data}).then((response) => {
        this.reloadData();
        resolve(response);
      })
    }, (error) => {

    });
  },
  pushAppendOrderingPreference(resourceId, attribute) {
    return new Ember.RSVP.Promise((resolve) => {
      const data = JSON.stringify({
        data: {
          type: 'ordering-preference',
          attributes: {
            resource: resourceId,
            ...attribute
          },
        }});

      this.get('ajax').post('/ordering-preference/', {data: data}).then((response) => {
        this.reloadData();
        resolve(response);
      })
    }, (error) => {

    });
  },

  createResouceGroup(groupId, resources) {
    this._sendData('add_group', {
      resource_group: groupId,
      resources: resources.join(' '),
    });
  },

  removeAgents(names, agentType) {
    let separator = undefined;

    switch (agentType) {
      case 'resource':
        separator = '_';
        break;
      case 'fence':
        separator = '-';
        break;
    }
    console.assert((typeof separator !== 'undefined'), `Invalid agentType (${agentType}) entered`);

    let jsonData = {};
    names.forEach((i) => {
      jsonData['resid' + separator + i] = 'true';
    });

    // @todo: add attribute force:true if required
    this._sendData('remove_resource', jsonData);
  },

  // @todo: should it be a promise?
  _sendData(endpoint, data) {
    let url = '/managec/' + this.get('clusterName') + '/' + endpoint;

    this.get('ajax').post(url, {
      data: _jsonToQueryString(data)
    }).then(() => {
      this.reloadData();
    })
  },

  _sendResourceId(endpoint, resourceName) {
    this._sendData(endpoint, {resource_id: resourceName});
  },

  destroyGroup(name) { this._sendResourceId('resource_ungroup', name); },

  createClone(name) { this._sendResourceId('resource_clone', name); },
  destroyClone(name) { this._sendResourceId('resource_unclone', name); },

  createMaster(name) { this._sendResourceId('resource_master', name); },
  destroyMaster(name) { this._sendResourceId('resource_unclone', name); },
});
