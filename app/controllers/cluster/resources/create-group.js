import Ember from 'ember';

export default Ember.Controller.extend({
  notifications: Ember.inject.service('notifications'),

  validResources: Ember.A(),
  groupedResources: Ember.A(),
  resourceForm: Ember.Object.create(),

  allResources: function computeResources() {
    // this is executed only once; cannot be in init() as model is not defined there
    // @todo add everything to validResource and remove those already in grouped
    this.get('model.resources').forEach((item) => {
      this.get('validResources').addObject(item);
    });

    this.get('groupedResources').forEach((item) => {
      this.get('validResources').removeObject(item);
    });

    return this.get('model.resources');
  }.property('model.resources.[]'),

  actions: {
    moveFromGroup(resource) {
      this.get('groupedResources').removeObject(resource);
      this.get('validResources').addObject(resource);
    },
    moveToGroup(resource) {
      this.get('validResources').removeObject(resource);
      this.get('groupedResources').addObject(resource);
    },
    sortEndAction() {
      // @todo: do real action
    },
    createGroup(form) {
      const resourceIDInGroup = [];
      this.get('groupedResources').forEach((i) => {
        resourceIDInGroup.push(i.get('name'));
      });

      this.get('notifications').notificationSaveRecord(
        undefined,
        'CREATE_GROUP',
        this.store.createResouceGroup(form.get('groupName'), resourceIDInGroup),
      );

      this.transitionToRoute('cluster.resources.index');
    },
  },
});
