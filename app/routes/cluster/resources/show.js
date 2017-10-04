import Ember from 'ember';
import categorizeProperties from '../../../utils/categorize-properties';
import TabRoute from '../../tab-route';
import ScoreValidations from '../../../validators/constraint-validations';
import {
  validatePresence,
} from 'ember-changeset-validations/validators';
import validateScore from '../../../validators/score';

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

    const formValidators = {
      addMetaAttribute: {
        key: validatePresence(true),
        value: validatePresence(true),
      },
      addUtilizationAttribute: {
        name: validatePresence(true),
        value: validatePresence(true),
      },
      addLocationPreference: {
        node: validatePresence(true),
        score: validateScore(),
      },
      addColocationPreference: {
        targetResource: validatePresence(true),
        score: validateScore(),
      },
      addOrderingPreference: {
        targetResource: validatePresence(true),
        score: validateScore(),
      },
      addTicketPreference: {
        ticket: validatePresence(true),
      }
    };

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
      validations: formValidators,
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

    addLocationPreference: function(form) {
      const preference = this.get('store').createRecord('location-preference', {
        resource: this.get('resource'),
        node: form.get('node'),
        score: form.get('score'),
      });
      return this._notificationSaveAttribute(preference, 'ADD_LOCATION_PREFERENCE');
    },

    addColocationPreference: function(form) {
      const preference = this.get('store').createRecord('colocation-preference', {
        resource: this.get('resource'),
        targetResource: form.get('targetResource'),
        colocationType: form.get('colocationType'),
        score: form.get('score'),
      });
      return this._notificationSaveAttribute(preference, 'ADD_COLOCATION_PREFERENCE');
    },

    addOrderingPreference: function(form) {
      const preference = this.get('store').createRecord('ordering-preference', {
        resource: this.get('resource'),
        targetResource: form.get('targetResource'),
        targetAction: form.get('targetAction'),
        score: form.get('score'),
        order: form.get('order'),
        action: form.get('action'),
      });
      return this._notificationSaveAttribute(preference, 'ADD_ORDERING_PREFERENCE');
    },

    addSetOrderingPreference: function(form) {
      const preferenceSet = this.get('store').createRecord('constraint-set');
      const cluster = this.store.peekAll('cluster').objectAt(0);

      preferenceSet.set('cluster', cluster);
      preferenceSet.set('type', 'ord');
      this._updateDynamicResources(form, preferenceSet);

      return this._notificationSaveAttribute(preferenceSet, 'ADD_ORDERING_SET_PREFERENCE');
    },

    addSetColocationPreference: function(form) {
      const preferenceSet = this.get('store').createRecord('constraint-set');
      const cluster = this.store.peekAll('cluster').objectAt(0);

      preferenceSet.set('cluster', cluster);
      preferenceSet.set('type', 'col');
      this._updateDynamicResources(form, preferenceSet);

      return this._notificationSaveAttribute(preferenceSet, 'ADD_COLOCATION_SET_PREFERENCE');
    },

    addTicketPreference: function(form) {
      const preference = this.get('store').createRecord('ticket-preference', {
        resource: this.get('resource'),
        ticket: form.get('ticket'),
        role: form.get('role'),
        lossPolicy: form.get('lossPolicy'),
      });
      return this._notificationSaveAttribute(preference, 'ADD_TICKET_PREFERENCE');
    },
    addSetTicketPreference: function(form) {
      const preferenceSet = this.get('store').createRecord('constraint-set');
      const cluster = this.store.peekAll('cluster').objectAt(0);

      preferenceSet.set('cluster', cluster);
      preferenceSet.set('type', 'ticket');
      preferenceSet.set('ticket', form.get('ticketName'));
      preferenceSet.set('lossPolicy', form.get('lossPolicy'));
      this._updateDynamicResources(form, preferenceSet);

      return this._notificationSaveAttribute(preferenceSet, 'ADD_TICKET_SET_PREFERENCE');
    },


    addMetaAttribute: function(form) {
      const attribute = this.get('store').createRecord('attribute', {
        resource: this.get('resource'),
        key: form.get('key'),
        value: form.get('value'),
      })
      return this._notificationSaveAttribute(attribute, 'ADD_META_ATTRIBUTE');
    },

    addUtilizationAttribute: function(form) {
      const attribute = this.get('store').createRecord('utilization-attribute', {
        resource: this.get('resource'),
        name: form.get('name'),
        value: form.get('value'),
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
    });

    return Ember.RSVP.Promise.resolve();
  },

  // Parse 'dynamic-fields' for resources and update constraintSet
  _updateDynamicResources(form, constraintSet) {
    form.get('resources').forEach((line) => {
      if (line.get('value.length') === 0) {
        return;
      }

      const resourceSet = this.get('store').createRecord('resource-set');
      line.get('value').forEach((resourceName) => {
        resourceSet.get('resources').addObject(this.store.peekRecordQueryName('resource', resourceName));
      });
      constraintSet.get('resourceSets').addObject(resourceSet);
    });
  },
});
