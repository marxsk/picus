import { moduleForModel } from 'ember-qunit';
import { skip } from 'qunit';

moduleForModel('application', 'Unit | Serializer | application', {
  // Specify the other units that are required for this test.
  needs: ['serializer:application'],
});

// Problem in blueprint: https://github.com/ember-cli/ember-cli/issues/4879
skip('it serializes records', function (assert) {
  const record = this.subject();

  const serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
