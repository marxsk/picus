import { module, test } from 'qunit';
import validateConstraintValidations from 'picus/validators/constraint-validations';

module('Unit | Validator | constraint-validations');

test('it exists', function(assert) {
  assert.ok(validateConstraintValidations());
});
