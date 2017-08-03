import { module, test } from 'qunit';
import validateScore from 'picus/validators/score';

module('Unit | Validator | score');

test('it exists', function(assert) {
  assert.ok(validateScore());
});
