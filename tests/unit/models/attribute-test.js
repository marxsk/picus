import { moduleForModel, test } from 'ember-qunit';

moduleForModel('attribute', 'Unit | Model | attribute', {
  needs: ['model:resource'],
});

test('it exists', function (assert) {
  const model = this.subject();
  assert.ok(!!model);
});

test('has required attributes', function (assert) {
  const model = this.subject();
  const attrNames = ['key', 'value'];

  assert.expect(attrNames.length);
  attrNames.forEach((attrName) => {
    assert.ok(
      Object.keys(model.toJSON()).indexOf(attrName) > -1,
      `attribute ${attrName} is missing`,
    );
  });
});
