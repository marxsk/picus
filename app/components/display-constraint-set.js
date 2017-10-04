import Ember from 'ember';

export default Ember.Component.extend({
  relevantSets: Ember.computed('resource', 'attributes.@each', {
    get() {
      return this.get('attributes').filter((constraintSet) => {
        return constraintSet.get('resourceSets').any((resourceSet) => {
          return resourceSet.get('resources').any((resource) => {
            return resource.get('name') === this.get('resource.name');
          });
        });
      });
    }
  }),
});
