import { formatEnabled } from 'picus/helpers/format-enabled';
import { module, test } from 'qunit';

module('Unit | Helper | format enabled');

test('it works', function(assert) {
  assert.expect(2);

  assert.equal(formatEnabled(true), 'enabled');
  assert.equal(formatEnabled(false), 'disabled');
});
