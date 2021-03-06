import Ember from 'ember';
import { validatePresence } from 'ember-changeset-validations/validators';
import TabRoute from 'picus/routes/tab-route';
import ScoreValidations from 'picus/validators/constraint-validations';
import validateScore from 'picus/validators/score';

export default TabRoute.extend({
  modelForm: {},
  resource: undefined,

  async model(params) {
    const resource = this.store.peekRecordQueryName('resource', params.resource_name);
    this.set('resource', resource);

    if (!resource) {
      return Ember.RSVP.hash({
        resourceNotFound: true,
        updatingCluster: this.store.peekAll('cluster'),
        params,
        ScoreValidations,
      });
    }

    let metadata;

    if (resource.get('resourceType') === 'primitive') {
      metadata = await this.store.getAgentMetadata(
        'resource',
        `${resource.get('resourceProvider')}:${resource.get('agentType')}`,
      );
    }

    if (resource.get('properties')) {
      resource.get('properties').forEach((item) => {
        this.set(`modelForm.${item.get('name')}`, item.get('value'));
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
        _targetResources_0: validatePresence({
          presence: true,
          message: 'You have to select a resource to colocate with',
        }),
        score: validateScore(),
      },
      addOrderingPreference: {
        _targetResources_0: validatePresence({
          presence: true,
          message: 'You have to select a resource',
        }),
        score: validateScore(),
      },
      addTicketPreference: {
        ticket: validatePresence(true),
      },
    };

    return Ember.RSVP.hash({
      params,
      metadata,
      formData: this.get('modelForm'),
      updatingCluster: this.store.peekAll('cluster'),
      selectedResource: resource,
      resources: this.store.peekAll('resource'),
      ScoreValidations,
      validations: formValidators,
    });
  },

  actions: {
    setConstraintSet(record, value, z) {
      record.set('selected', value);
    },
    setIsEmpty(record) {
      if (!record) return false;
      return record.getWithDefault('selected.length', 0) === 0;
    },

    onSubmitAction(form) {
      const resource = this.get('resource');
      form.get('changes').forEach((obj) => {
        const existingProps = this.get('store')
          .peekAll('resource-property')
          .filterBy('name', obj.key)
          .filterBy('resource.name', resource.get('name'));

        if (existingProps.length === 0) {
          resource.get('properties').addObject(this.get('store').createRecord('resource-property', {
            resource,
            name: obj.key,
            value: obj.value,
          }));
        } else {
          existingProps[0].set('value', obj.value);
        }
      });

      this.transitionTo('cluster.resources.index');
      this.set('modelForm', {});
      return this.get('notifications').notificationSaveRecord(resource, 'UPDATE_RESOURCE');
    },
    changeSelectedAgent() {},

    deletePreference(actionName, constraint) {
      constraint.deleteRecord();
      this.get('notifications').notificationSaveRecord(constraint, actionName);
    },

    addLocationPreference(form) {
      const preference = this.get('store').createRecord('location-preference', {
        resource: this.get('resource'),
        node: form.get('node.name'),
        score: form.get('score'),
      });
      return this.get('notifications').notificationSaveRecord(
        preference,
        'ADD_LOCATION_PREFERENCE',
      );
    },

    addColocationPreference(form) {
      const preference = this.get('store').createRecord('colocation-preference', {
        resource: this.get('resource'),
        targetResource: form.get('targetResources.firstObject'),
        colocationType: form.get('colocationType'),
        score: form.get('score'),
      });
      return this.get('notifications').notificationSaveRecord(
        preference,
        'ADD_COLOCATION_PREFERENCE',
      );
    },

    addOrderingPreference(form) {
      const preference = this.get('store').createRecord('ordering-preference', {
        resource: this.get('resource'),
        targetResource: form.get('targetResources.firstObject'),
        targetAction: form.get('targetAction'),
        score: form.get('score'),
        order: form.get('order'),
        action: form.get('action'),
      });
      return this.get('notifications').notificationSaveRecord(
        preference,
        'ADD_ORDERING_PREFERENCE',
      );
    },

    addSetOrderingPreference(form) {
      const preferenceSet = this.get('store').createRecord('constraint-set');
      const cluster = this.store.peekAll('cluster').objectAt(0);

      preferenceSet.set('cluster', cluster);
      preferenceSet.set('type', 'ord');
      this._updateDynamicResources(form, preferenceSet);

      return this.get('notifications').notificationSaveRecord(
        preferenceSet,
        'ADD_ORDERING_SET_PREFERENCE',
      );
    },

    addSetColocationPreference(form) {
      const preferenceSet = this.get('store').createRecord('constraint-set');
      const cluster = this.store.peekAll('cluster').objectAt(0);

      preferenceSet.set('cluster', cluster);
      preferenceSet.set('type', 'col');
      this._updateDynamicResources(form, preferenceSet);

      return this.get('notifications').notificationSaveRecord(
        preferenceSet,
        'ADD_COLOCATION_SET_PREFERENCE',
      );
    },

    addTicketPreference(form) {
      const preference = this.get('store').createRecord('ticket-preference', {
        resource: this.get('resource'),
        ticket: form.get('ticket'),
        role: form.get('role'),
        lossPolicy: form.get('lossPolicy'),
      });
      return this.get('notifications').notificationSaveRecord(preference, 'ADD_TICKET_PREFERENCE');
    },
    addSetTicketPreference(form) {
      const preferenceSet = this.get('store').createRecord('constraint-set');
      const cluster = this.store.peekAll('cluster').objectAt(0);

      preferenceSet.set('cluster', cluster);
      preferenceSet.set('type', 'ticket');
      preferenceSet.set('ticket', form.get('ticketName'));
      preferenceSet.set('lossPolicy', form.get('lossPolicy'));
      this._updateDynamicResources(form, preferenceSet);

      return this.get('notifications').notificationSaveRecord(
        preferenceSet,
        'ADD_TICKET_SET_PREFERENCE',
      );
    },

    addMetaAttribute(form) {
      const attribute = this.get('store').createRecord('resource-attribute', {
        resource: this.get('resource'),
        key: form.get('key'),
        value: form.get('value'),
      });
      return this.get('notifications').notificationSaveRecord(attribute, 'ADD_META_ATTRIBUTE');
    },

    addUtilizationAttribute(form) {
      const attribute = this.get('store').createRecord('resource-utilization-attribute', {
        resource: this.get('resource'),
        name: form.get('name'),
        value: form.get('value'),
      });
      return this.get('notifications').notificationSaveRecord(
        attribute,
        'ADD_UTILIZATION_ATTRIBUTE',
      );
    },

    removeResource(resource) {
      resource.deleteRecord();
      this.transitionTo('cluster.resources.index');
      return this.get('notifications').notificationSaveRecord(resource, 'REMOVE_RESOURCE');
    },

    createClone(resourceName) {
      this.store.createClone(resourceName);
      this.transitionTo('cluster.resources.index');
    },

    removeClone(resourceName) {
      this.store.destroyClone(resourceName);
      this.transitionTo('cluster.resources.index');
    },
    removeGroup(resourceName) {
      this.store.destroyGroup(resourceName);
      this.transitionTo('cluster.resources.index');
    },

    createMaster(resourceName) {
      this.store.createMaster(resourceName);
      this.transitionTo('cluster.resources.index');
    },
    removeMaster(resourceName) {
      this.store.destroyMaster(resourceName);
      this.transitionTo('cluster.resources.index');
    },

    reload() {
      this.store.reloadData();
    },
  },

  // Parse 'dynamic-fields' for resources and update constraintSet
  _updateDynamicResources(form, constraintSet) {
    form.get('resources').forEach((line) => {
      if (line.get('length') === 0) {
        return;
      }

      const resourceSet = this.get('store').createRecord('resource-set');
      line.forEach((resourceName) => {
        resourceSet
          .get('resources')
          .addObject(this.store.peekRecordQueryName('resource', resourceName));
      });
      constraintSet.get('resourceSets').addObject(resourceSet);
    });
  },
});
