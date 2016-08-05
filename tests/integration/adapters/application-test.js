import { moduleFor, test } from 'ember-qunit';
import startMirage from '../../helpers/setup-mirage-for-integration';

moduleFor('adapter:application', 'Integration | Adapter | application', {
  integration: true,

  beforeEach() {
    startMirage(this.container);
  },
  afterEach() {
    window.server.shutdown();
  }
});

test('route for reloading data from server', function(assert) {
  // no asserts are expected because resulting promise is handled by qunit itself
  assert.expect(0);
  const adapter = this.subject();

  return adapter.reloadData();
});
