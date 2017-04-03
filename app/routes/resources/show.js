import Ember from 'ember';

export default Ember.Route.extend({
  modelForm: {},
  resourceId: undefined,
  selectedResources: Ember.A(),

  beforeModel() {
    return this.store.reloadData();
  },

  model(params) {
    const resource = this.store.peekRecord('resource', params.resource_id);
    this.set('resourceId', params.resource_id);

    if (resource === null) {
      return Ember.RSVP.hash({
        listing: (params.resource_id.length === 0) ? true : false,
        cluster: this.store.peekAll('cluster'),
        params: params,
      });
    }

    let ourName = resource.get('name');
    let otherResourcesName = this.store.peekAll('resource').map((i) => { return i.get('name'); });
    otherResourcesName = otherResourcesName.filter((name) => { return name !== ourName; } );

    if (resource.get('properties')) {
      resource.get('properties').forEach((item) => {
        this.set('modelForm.' + item.get('name'), item.get('value'));
      });
    }

    return Ember.RSVP.hash({
      params: params,
      metadata: this.store.getAgentMetadata('resource', this.store.peekRecord('resource', params.resource_id).get('resourceProvider') + ':' + this.store.peekRecord('resource', params.resource_id).get('resourceType')),
      formData: this.get('modelForm'),
      cluster: this.store.peekAll('cluster'),
      selectedResource: this.store.filter('resource', (item) => { return item.id === params.resource_id; }),
      otherResourcesName: otherResourcesName,
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

      this.transitionTo('resources.show', '');
    },
    onCheckx: function(x) {
      if (this.get('selectedResources').includes(x)) {
        this.get('selectedResources').removeObject(x);
      } else {
        this.get('selectedResources').addObject(x);
      }
    },
    removeSelectedResources: function() {
        let names = [];
        this.get('selectedResources').forEach((x) => {
          names.push(x.get('name'));
        });
        this.store.removeAgents(names, 'resource');
        this.transitionTo('resources.show', '');
    },
    changeSelectedAgent: function() {},

    appendMetaAttribute: function(attributes, attr) {
      this.store.pushAppendMetaAttribute(this.get('resourceId'), attr);
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
      this.transitionTo('resources.show', '');
    },

    appendLocationPreference: function(attributes, attr) {
      this.store.pushAppendLocationPreference(this.get('resourceId'), attr);
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
  }
});
