import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('resource', 'Unit | Model | resource', {
  needs: []
});

test('it exists', function(assert) {
  const model = this.subject();
  assert.ok(!!model);
});

test('has required attributes', function(assert) {
  const model = this.subject();
  const attrNames = ['name', 'status', 'resourceType'];

  assert.expect(attrNames.length);
  for (var attrName of attrNames) {
    assert.ok(Object.keys(model.toJSON()).indexOf(attrName) > -1, 'attribute ' + attrName + ' is missing');
  }
});

test('has relationship to children resources', function(assert) {
  const model = this.store().modelFor('resource');
  const relationship = Ember.get(model, 'relationshipsByName').get('children');

  assert.expect(2);
  assert.equal(relationship.key, 'children', 'relation is not names "children"');
  assert.equal(relationship.kind, 'hasMany', 'relation "children" is not defined with "hasMany"');
});
