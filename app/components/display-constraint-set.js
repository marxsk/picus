import Ember from 'ember';

export default Ember.Component.extend({
  relevantSets: Ember.computed('resource', 'attributes.@each', {
    get() {
      return this.get('attributes').filter(constraintSet =>
        constraintSet
          .get('resourceSets')
          .any(resourceSet =>
            resourceSet
              .get('resources')
              .any(resource => resource.get('name') === this.get('resource.name'))));
    },
  }),
});
