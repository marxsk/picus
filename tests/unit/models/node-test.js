import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('node', 'Unit | Model | node', {
  needs: ['model:attribute'],
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

test('has relationship to attributes', function (assert) {
  const model = this.store().modelFor('node');
  const relationship = Ember.get(model, 'relationshipsByName').get('nodeAttributes');

  assert.equal(relationship.key, 'nodeAttributes', 'relation is not named "nodeAttributes"');
  assert.equal(
    relationship.kind,
    'hasMany',
    'relation "nodeAttributes" is not defined with "hasMany"',
  );
});
