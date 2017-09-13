import Ember from 'ember';
import categorizeProperties from '../../../utils/categorize-properties';
import TabRoute from '../../tab-route';
import ScoreValidations from '../../../validators/constraint-validations';

export default TabRoute.extend({
  modelForm: {},
  resource: undefined,
  selectedResources: Ember.A(),
  notifications: Ember.inject.service('notifications'),
  messages: Ember.inject.service('messages'),

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
    const resource = this.store.peekRecordQueryName('resource', params.resource_name);
    this.set('resource', resource);

    if (resource === null) {
      return Ember.RSVP.hash({
        listing: (params.resource_id.length === 0) ? true : false,
        updatingCluster: this.store.peekAll('cluster'),
        selectedResources: this.get('selectedResources'),
        params: params,
        ScoreValidations,
      });
    }

    let metadata;
    let parameters;
    let validations;

    if (resource.get('resourceType') === 'primitive') {
      metadata = await this.store.getAgentMetadata('resource', resource.get('resourceProvider') + ':' + resource.get('agentType'));
      const x = categorizeProperties(metadata.parameters);
      parameters = x.parameters;
      validations = x.validations;
    }

    if (resource.get('properties')) {
      resource.get('properties').forEach((item) => {
        this.set('modelForm.' + item.get('name'), item.get('value'));
      });
    }

    return Ember.RSVP.hash({
      params: params,
      metadata: metadata,
      parameters: parameters,
      formData: this.get('modelForm'),
      updatingCluster: this.store.peekAll('cluster'),
      selectedResource: resource,
      resources: this.store.peekAll('resource'),
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
        this.get('selectedResources').map((x) => {
          return x.get('name');
        }),
        'resource'
      );
      this.get('selectedResources').clear();
      this.transitionTo('cluster.resources.index');
    },
    changeSelectedAgent: function() {},

    deletePreference: function(actionName, constraint) {
      constraint.deleteRecord();
      this._notificationSaveAttribute(constraint, actionName);
    },

    appendLocationPreference: function(attributes) {
      const preference = this.get('store').createRecord('location-preference', {
        resource: this.get('resource'),
        node: attributes.node,
        score: attributes.score,
      });
      return this._notificationSaveAttribute(preference, 'ADD_LOCATION_PREFERENCE');
    },

    appendColocationPreference: function(attributes) {
      const preference = this.get('store').createRecord('colocation-preference', {
        resource: this.get('resource'),
        targetResource: attributes.targetResource,
        colocationType: attributes.colocationType,
        score: attributes.score,
      });
      return this._notificationSaveAttribute(preference, 'ADD_COLOCATION_PREFERENCE');
    },

    appendOrderingPreference: function(attributes) {
      const preference = this.get('store').createRecord('ordering-preference', {
        resource: this.get('resource'),
        targetResource: attributes.targetResource,
        targetAction: attributes.targetAction,
        score: attributes.score,
        order: attributes.order,
        action: attributes.action,
      });
      return this._notificationSaveAttribute(preference, 'ADD_ORDERING_PREFERENCE');
    },

    appendTicketPreference: function(attributes) {
      const preference = this.get('store').createRecord('ticket-preference', {
        resource: this.get('resource'),
        ticket: attributes.ticket,
        role: attributes.role,
        lossPolicy: attributes.lossPolicy,
      });
      return this._notificationSaveAttribute(preference, 'ADD_TICKET_PREFERENCE');
    },

    appendMetaAttribute: function(attributes) {
      const attribute = this.get('store').createRecord('attribute', {
        resource: this.get('resource'),
        key: attributes.key,
        value: attributes.value,
      })
      return this._notificationSaveAttribute(attribute, 'ADD_META_ATTRIBUTE');
    },

    appendUtilizationAttribute: function(attributes) {
      const attribute = this.get('store').createRecord('utilization-attribute', {
        resource: this.get('resource'),
        name: attributes.name,
        value: attributes.value,
      });
      return this._notificationSaveAttribute(attribute, 'ADD_UTILIZATION_ATTRIBUTE');
    },

    removeResource: function(resourceName) {
      this.store.removeAgents([resourceName], 'resource');
      this.transitionTo('cluster.resources.index');
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
    },
  },

  // Save changes and show notification messages
  _notificationSaveAttribute(attribute, actionName) {
    const notificationData = Ember.Object.create(
      {
        data: {
          action: actionName,
          record: attribute,
        }
      }
    );
    const messages = this.get('messages').getNotificiationMessage(notificationData, actionName);

    const progressNotification = this.get('notifications').progress(messages.progress);
    attribute.save().then(() => {
      this.get('notifications').updateNotification(
        progressNotification,
        'SUCCESS',
        messages.success
      );
    }, (xhr) => {
      this.get('notifications').updateNotification(
        progressNotification,
        'ERROR',
        messages.error,
        {
          action: notificationData.action,
          record: notificationData.record,
          response: xhr,
        }
      );
    })
  }
});
