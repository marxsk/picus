import { moduleFor, test } from 'ember-qunit';

moduleFor('component:display-constraint-set', 'Unit | Component | display-constraint-set', {});

test('computedProperty relevantSets', function(assert) {
  const component = this.subject();

  const resource1 = Ember.Object.create({name: 'resource1'});
  const resource2 = Ember.Object.create({name: 'resource2'});
  const resource3 = Ember.Object.create({name: 'resource3'});
  const resource4 = Ember.Object.create({name: 'resource4'});
  const resourceSet1 = Ember.A([resource1, resource2]);
  const resourceSet2 = Ember.A([resource1, resource3, resource4]);
  const rs1 = Ember.Object.create({resources: resourceSet1});
  const rs2 = Ember.Object.create({resources: resourceSet2});
  const constraintSet1 = Ember.A([rs1, rs2]);
  const cs1 = Ember.Object.create({resourceSets: constraintSet1});
  const constraintSets = Ember.A([cs1]);

  component.set('attributes', constraintSets);

  component.set('resource', Ember.Object.create({name: 'resource1'}));
  assert.equal(component.get('relevantSets.length'), 1, 'Resource is part of the constraint-set');

  component.set('resource', Ember.Object.create({name: 'unknown'}));
  assert.equal(component.get('relevantSets.length'), 0, 'Resource is not part of the constraint-set');
});
