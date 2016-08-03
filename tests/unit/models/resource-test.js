import { moduleForModel, test } from 'ember-qunit';

moduleForModel('resource', 'Unit | Model | resource', {
  needs: []
});

test('it exists', function(assert) {
  let model = this.subject();
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
