import Ember from 'ember';

export default Ember.Controller.extend({
  validResources: Ember.A(),
  groupedResources: Ember.A(),
  resourceForm: Ember.Object.create(),

  allResources: function() {
    // this is executed only once; cannot be in init() as model is not defined there
    // option) add everything to validResource and remove those already in grouped
    this.get('model.resources').forEach((item) => {
      this.get('validResources').addObject(item);
    });

    this.get('groupedResources').forEach((item) => {
      this.get('validResources').removeObject(item);
    });

    return this.get('model.resources');
  }.property('model.resources.[]'),

    actions: {
      increaseRating: function(xyz) {
        this.get('groupedResources').removeObject(xyz);
        this.get('validResources').addObject(xyz);
      },
      increaseRating2: function(xyz) {
        this.get('validResources').removeObject(xyz);
        this.get('groupedResources').addObject(xyz);
      },
      sortEndAction: function() {
        console.log(this.get('groupedResources'));
      },
      createGroup: function(form) {
        let resourceIDInGroup = [];
        this.get('groupedResources').forEach((i) => {
          resourceIDInGroup.push(i.get('name'));
        });

        this.store.createResouceGroup(form.get('groupName'), resourceIDInGroup);
        this.transitionToRoute('resources.show', '');
      }
    },
});
