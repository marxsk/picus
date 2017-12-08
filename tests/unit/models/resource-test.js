import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('resource', 'Unit | Model | resource', {
  needs: [
    'model:resource-property',
    'model:attribute',
    'model:utilization-attribute',
    'model:colocation-preference',
    'model:location-preference',
    'model:ordering-preference',
    'model:ticket-preference',
  ],
});

test('it exists', function (assert) {
  const model = this.subject();
  assert.ok(!!model);
});

test('has required attributes', function (assert) {
  const model = this.subject();
  const attrNames = ['name', 'status', 'resourceType'];

  assert.expect(attrNames.length);
  attrNames.forEach((attrName) => {
    assert.ok(
      Object.keys(model.toJSON()).indexOf(attrName) > -1,
      `attribute ${attrName} is missing`,
    );
  });
});

test('has relationship to children resources', function (assert) {
  const model = this.store().modelFor('resource');
  const relationship = Ember.get(model, 'relationshipsByName').get('resources');

  assert.expect(2);
  assert.equal(relationship.key, 'resources', 'relation is not names "resources"');
  assert.equal(relationship.kind, 'hasMany', 'relation "children" is not defined with "hasMany"');
});
