import DS from 'ember-data';
import Ember from 'ember';

function _jsonToQueryString(json) {
  return Object.keys(json)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`)
    .join('&');
}

export default DS.Store.extend({
  ajax: Ember.inject.service(),
  clusterName: undefined,

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
  isExpired: Ember.computed('expiresAt', 'ticktock.now', function isExpired() {
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
  init() {
    this.get('isExpired');
    return this._super();
  },

  /**
    Reload data if they have expired

    @method _reloader
  */
  _reloader: function _reloader() {
    if (this.get('isExpired')) {
      this.reloadData();
    }
  }.observes('ticktock.now', 'isExpired'),

  /** Set name of the active cluster

  Currently, it is possible to work with just one cluster at a given time.
  * */
  setActiveClusterName(clusterName) {
    this.set('clusterName', clusterName);
    return this.reloadData();
  },

  /** Reload all data from backend

  Traditionally, Store works on more standard API so we can ask for specific
  types with findAll(type) methods. In case of pcsd, we have just one single
  endpoint that returns complete store after one request. Method that reloads
  data belongs to Adapter class but we want to access it also from the standard
  code.

  * */
  async reloadData() {
    if (this.get('clusterName') === undefined) {
      return Ember.RSVP.resolve();
    }

    if (this.get('isQueryInProgress')) {
      this.set('isQueryInQueue', true);
      return Ember.RSVP.resolve();
    }

    this.set('isQueryInProgress', true);
    this.set('isQueryInQueue', false);
    this.set('expiresAt', this.get('ticktock.now') + this.get('validityTime'));

    const res = this.adapterFor('application').reloadData(this.get('clusterName'));
    const ser = this.serializerFor('application');
    const store = this;

    const prom = new Ember.RSVP.Promise((resolve, reject) => {
      res.then(
        (response) => {
          const modelClass = store.modelFor('cluster');
          const normalized = ser.normalizeSingleResponse(store, modelClass, response);

          const generateId = function generateId(json, parent) {
            return `${Ember.get(json, `${parent}type`)}::${Ember.get(json, `${parent}id`)}`;
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
            Ember.get(normalized, 'included').forEach((item) => {
              knownIds.addObject(generateId(item, ''));
            });
          }

          // remove records which no longer exists on backend from store for every used model
          [
            'node',
            'fence',
            'resource',
            'attribute',
            'acl-user',
            'resource-property',
            'fence-property',
            'property',
          ].forEach((modelName) => {
            store.peekAll(modelName).forEach((item) => {
              if (!knownIds.includes(`${modelName}::${item.get('id')}`)) {
                item.unloadRecord();
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
        },
        (error) => {
          //          alert(JSON.stringify(error));
          store.set('isQueryInProgress', false);
          if (store.get('isQueryInQueue')) {
            return store.reloadData();
          }
          return reject(error);
        },
      );
    });

    return prom;
  },

  /** Push new node into cluster * */
  // @todo: move to standard API
  pushNewNode(changeset) {
    const newNode = this.createRecord('node', {
      name: changeset.nodeName,
    });

    newNode.save().then(() => {
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
   * */
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

    Ember.Logger.assert(typeof url !== 'undefined', `Invalid agentType (${agentType}) entered`);

    return new Ember.RSVP.Promise(
      (resolve) => {
        this.get('ajax')
          .request(url)
          .then((response) => {
            const agents = {};
            agents._providers = [];

            Object.keys(response).forEach((agent) => {
              const lastSemicolon = agent.lastIndexOf(':');
              let provider = agent.substring(0, lastSemicolon);
              provider = provider === '' ? 'undefinedProvider' : provider;
              const name = agent.substring(lastSemicolon + 1);

              if (!(provider in agents)) {
                agents._providers.push(provider);
                agents[provider] = [];
              }
              agents[provider].push(name);
            });
            resolve(agents);
          });
      },
      (error) => {
        Ember.Logger.error(error);
      },
    );
  },

  /**
   * Download XML metadata that describes agent from pcsd
   *  @param {string} agentType - Type of agent (resource|fence)
   *  @param {string} agentName - Agent name without class/provider prefix
   *
   *  @todo Create proper error handlers
   */
  getAgentMetadata(agentType, agentName) {
    let url = `/managec/${this.get('clusterName')}`;

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

    Ember.Logger.assert(typeof url !== 'undefined', `Invalid agentType (${agentType}) entered`);

    return new Ember.RSVP.Promise(
      (resolve) => {
        this.get('ajax')
          .request(url, { data: { agent: agentName } })
          .then((response) => {
            resolve(response);
          });
      },
      (error) => {
        Ember.Logger.error(error);
      },
    );
  },

  _sendPostData(endpoint, rawData) {
    const url = `/managec/${this.get('clusterName')}/${endpoint}`;
    const data = JSON.stringify(rawData);

    return new Ember.RSVP.Promise(
      (resolve) => {
        this.get('ajax')
          .post(url, { data })
          .then((response) => {
            this.reloadData();
            resolve(response);
          });
      },
      (error) => {
        // @todo
      },
    );
  },

  createResouceGroup(groupId, resources) {
    return this._sendData('add_group', {
      resource_group: groupId,
      resources: resources.join(' '),
    });
  },

  removeAgents(agents, agentType) {
    let separator;

    switch (agentType) {
      case 'resource':
        separator = '_';
        break;
      case 'fence':
        separator = '-';
        break;
      default:
        Ember.Logger.error(`Unknown agent type ${agentType}`);
    }
    Ember.Logger.assert(
      typeof separator !== 'undefined',
      `Invalid agentType (${agentType}) entered`,
    );

    const jsonData = {};
    agents.forEach((i) => {
      jsonData[`resid${separator}${i.get('name')}`] = 'true';
      i.deleteRecord();
    });

    // we are not using save() as it will do multiple requests and we need just one
    // delete() is important for marking entry as a deleted so menu can change

    // @todo: add attribute force:true if required
    return this._sendData('remove_resource', jsonData);
  },

  _sendData(endpoint, data) {
    const url = `/managec/${this.get('clusterName')}/${endpoint}`;

    return this.get('ajax')
      .post(url, {
        data: _jsonToQueryString(data),
      })
      .then(() => {
        this.reloadData();
      });
  },

  _sendResourceId(endpoint, resourceName) {
    this._sendData(endpoint, { resource_id: resourceName });
  },

  destroyGroup(name) {
    this._sendResourceId('resource_ungroup', name);
  },

  createClone(name) {
    this._sendResourceId('resource_clone', name);
  },
  destroyClone(name) {
    this._sendResourceId('resource_unclone', name);
  },

  createMaster(name) {
    this._sendResourceId('resource_master', name);
  },
  destroyMaster(name) {
    this._sendResourceId('resource_unclone', name);
  },

  loadClusters() {
    return new Ember.RSVP.Promise(
      (resolve) => {
        this.get('ajax')
          .request('/clusters_overview')
          .then((response) => {
            resolve(response.cluster_list);
          });
      },
      (error) => {
        Ember.Logger.error(error);
      },
    );
  },

  // @note: should it return promise?
  _sendAclData(url, data) {
    this.get('ajax')
      .post(url, {
        data: JSON.stringify({ data }),
      })
      .then(() => {
        this.reloadData();
      });
  },

  /**
   * Query for single record on top of the already loaded data
   * */
  peekRecordQueryName(modelName, name) {
    return this.peekAll(modelName)
      .filterBy('name', name)
      .get('firstObject');
  },

  getFencePlugs() {
    const url = `/managec/${this.get('clusterName')}/mock/get-list`;

    return this.get('ajax').post(url, {
      data: _jsonToQueryString({}),
    });
  },
});
