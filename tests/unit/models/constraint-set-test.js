import { moduleForModel, test } from 'ember-qunit';

moduleForModel('constraint-set', 'Unit | Model | constraint set', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
