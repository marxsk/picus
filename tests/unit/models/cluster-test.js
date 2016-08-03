import { moduleForModel, test } from 'ember-qunit';

moduleForModel('cluster', 'Unit | Model | cluster', {
  needs: []
});

test('it exists', function(assert) {
  const model = this.subject();
  assert.ok(!!model);
});

test('has required attributes', function(assert) {
  const model = this.subject();
  const attrNames = ['name', 'status'];

  assert.expect(attrNames.length);
  for (var attrName of attrNames) {
    assert.ok(Object.keys(model.toJSON()).indexOf(attrName) > -1, 'attribute ' + attrName + ' is missing');
  }
});
