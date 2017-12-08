import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('cluster', 'Unit | Model | cluster', {
  needs: [
    'model:node',
    'model:resource',
    'model:property',
    'model:fence',
    'model:acl-user',
    'model:acl-role',
    'model:acl-group',
    'model:constraint-set',
  ],
});

test('it exists', function (assert) {
  const model = this.subject();
  assert.ok(!!model);
});

test('has required attributes', function (assert) {
  const model = this.subject();
  const attrNames = ['name', 'status'];

  assert.expect(attrNames.length);
  attrNames.forEach((attrName) => {
    assert.ok(
      Object.keys(model.toJSON()).indexOf(attrName) > -1,
      `attribute ${attrName} is missing`,
    );
  });
});

test('has relationship to nodes', function (assert) {
  const model = this.store().modelFor('cluster');
  const relationship = Ember.get(model, 'relationshipsByName').get('nodes');

  assert.equal(relationship.key, 'nodes', 'relation is not names "nodes"');
  assert.equal(relationship.kind, 'hasMany', 'relation "nodes" is not defined with "hasMany"');
});

test('has relationship to resources', function (assert) {
  const model = this.store().modelFor('cluster');
  const relationship = Ember.get(model, 'relationshipsByName').get('resources');

  assert.equal(relationship.key, 'resources', 'relation is not names "resources"');
  assert.equal(relationship.kind, 'hasMany', 'relation "resources" is not defined with "hasMany"');
});
