import Ember from 'ember';
import categorizeProperties from '../../../utils/categorize-properties';
import TabRoute from '../../tab-route';
import ScoreValidations from '../../../validators/constraint-validations';

export default TabRoute.extend({
  modelForm: {},
  resourceId: undefined,
  selectedResources: Ember.A(),

  queryParams: {
    filterString: {
      as: 's',
      replace: true
    }
  },

  beforeModel() {
    this.get('selectedResources').clear();
  },

  setupController(controller, model) {
    this._super(controller, model);
    // hide sidebar menu
    this.controllerFor('application').set('hideMainMenu', true);
   },

  async model(params) {
    const resource = this.store.peekRecord('resource', params.resource_id);
    this.set('resourceId', params.resource_id);

    if (resource === null) {
      return Ember.RSVP.hash({
        listing: (params.resource_id.length === 0) ? true : false,
        updatingCluster: this.store.peekAll('cluster'),
        selectedResources: this.get('selectedResources'),
        params: params,
        ScoreValidations,
      });
    }

    let ourName = resource.get('name');
    let otherResourcesName = this.store.peekAll('resource').map((i) => { return i.get('name'); });
    otherResourcesName = otherResourcesName.filter((name) => { return name !== ourName; } );

    const metadata = await this.store.getAgentMetadata('resource', this.store.peekRecord('resource', params.resource_id).get('resourceProvider') + ':' + this.store.peekRecord('resource', params.resource_id).get('agentType'));
    let {parameters, validations} = categorizeProperties(metadata.parameters);

    if (resource.get('properties')) {
      resource.get('properties').forEach((item) => {
        this.set('modelForm.' + item.get('name'), item.get('value'));
      });
    }

    return Ember.RSVP.hash({
      params: params,
      metadata: this.store.getAgentMetadata('resource', this.store.peekRecord('resource', params.resource_id).get('resourceProvider') + ':' + this.store.peekRecord('resource', params.resource_id).get('agentType')),
      parameters: parameters,
      formData: this.get('modelForm'),
      updatingCluster: this.store.peekAll('cluster'),
      selectedResource: this.store.peekRecord('resource', params.resource_id),
      otherResourcesName: otherResourcesName,
      ResourceValidations: validations,
      ScoreValidations,
    });
  },

  actions: {
    onSubmitAction: function(resource, form) {
      this.store.pushUpdateAgentProperties('resource', {
        name: resource.get('name'),
        agentProvider: resource.get('selectedProvider'),
        agentType: resource.get('selectedAgent'),
        properties: form.get('changes'),
      }, 'update');

      this.transitionTo('cluster.resources.index');
    },
    onCheckx: function(x) {
      if (this.get('selectedResources').includes(x)) {
        this.get('selectedResources').removeObject(x);
      } else {
        this.get('selectedResources').pushObject(x);
      }
    },
    removeSelectedResources: function() {
      this.store.removeAgents(
        this.get('selectedResources').map((x) => {return x.get('name');}),
        'resource'
      );
      this.get('selectedResources').clear();
      this.transitionTo('cluster.resources.index');
    },
    changeSelectedAgent: function() {},

    appendLocationPreference: function(resourceName, attributes) {
      this.store.pushAppendLocationPreference(resourceName, attributes);
    },
    deleteLocationPreference: function(resourceName, attributes) {
      this.store.deleteLocationPreference(resourceName, attributes);
    },
    appendColocationPreference: function(resourceName, attributes) {
      this.store.pushAppendColocationPreference(resourceName, attributes);
    },
    deleteColocationPreference: function(resourceName, attributes) {
      this.store.deleteColocationPreference(resourceName, attributes);
    },
    appendUtilizationAttribute: function(resourceName, attributes) {
      this.store.pushAppendUtilizationAttribute(resourceName, attributes);
    },
    deleteUtilizationAttribute: function(resourceName, attributes) {
      this.store.deleteUtilizationAttribute(resourceName, attributes);
    },
    appendMetaAttribute: function(resourceName, attributes) {
      this.store.pushAppendMetaAttribute(resourceName, attributes);
    },
    deleteMetaAttribute: function(resourceName, attributes) {
      this.store.deleteMetaAttribute(resourceName, attributes);
    },

    deleteAttribute: function(attribute) {
      attribute.deleteRecord();
      attribute.save();
    },
    deleteAttributes: function(attributes) {
      attributes.forEach((item) => {
        item.deleteRecord();
        item.save();
      });
    },

    removeResource: function(resourceName) {
      this.store.removeAgents([resourceName], 'resource');
      this.transitionTo('cluster.resources.index');
    },

    appendOrderingPreference: function(attributes, attr) {
      // @todo: ugly hack, we should set this value in template?
      attr.before = ('before' in attr) ? attr.before : 'before';
      attr.action1 = ('action1' in attr) ? attr.action1 : 'starts';
      attr.action2 = ('action2' in attr) ? attr.action2 : 'starts';
      //

      console.log(JSON.stringify(attr));
      this.store.pushAppendOrderingPreference(this.get('resourceId'), attr);
    },

    createClone: function(resourceName) {
      this.store.createClone(resourceName);
      this.transitionTo('cluster.resources.index');
    },

    removeClone: function(resourceName) {
      this.store.destroyClone(resourceName);
      this.transitionTo('cluster.resources.index');
    },
    removeGroup: function(resourceName) {
      this.store.destroyGroup(resourceName);
      this.transitionTo('cluster.resources.index');
    },

    createMaster: function(resourceName) {
      this.store.createMaster(resourceName);
      this.transitionTo('cluster.resources.index');
    },
    removeMaster: function(resourceName) {
      this.store.destroyMaster(resourceName);
      this.transitionTo('cluster.resources.index');
    },

    reload: function() {
      this.store.reloadData();
    }
  }
});
