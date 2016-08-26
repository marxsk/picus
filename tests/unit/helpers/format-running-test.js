import { formatRunning } from 'picus/helpers/format-running';
import { module, test } from 'qunit';

module('Unit | Helper | format running');

test('it works', function(assert) {
  assert.expect(2);

  assert.equal(formatRunning(true), 'running');
  assert.equal(formatRunning(false), 'stopped');
});
