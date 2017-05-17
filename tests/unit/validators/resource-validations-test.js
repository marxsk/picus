import { module, test } from 'qunit';
import validateResourceValidations from 'picus/validators/resource-validations';

module('Unit | Validator | resource-validations');

test('it exists', function(assert) {
  assert.ok(validateResourceValidations());
});
