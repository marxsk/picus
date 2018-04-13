import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'picus/tests/helpers/module-for-acceptance';
import defaultScenario from '../../../../mirage/scenarios/default';
import startApp from '../../../helpers/start-app';

let application;

const mockTickTock = Ember.Service.extend({
  now: 111,
});

moduleForAcceptance('Acceptance | cluster/acl/role', {
  beforeEach() {
    server.shutdown();

    application = startApp();
    application.register('service:mockTickTock', mockTickTock);
    application.inject('service:store', 'ticktock', 'service:mockTickTock');

    defaultScenario(server);
  },
  afterEach() {
    Ember.run(application, 'destroy');
  },
});

test('visiting /cluster/CLUSTERID/acl/role/ROLEID', (assert) => {
  visit('/cluster/my/acl/role/Hugo');

  andThen(() => {
    assert.equal(currentURL(), '/cluster/my/acl/role/Hugo');
  });
});

test('add (and remove) ACL user to the ACL role', async (assert) => {
  visit('/cluster/my/acl/role/Hugo');

  // First button is 'Remove resource'; Second one is 'Add User'
  await click('button:eq(2)');
  assert.ok(find('label.form-field--label').length > 0, 'There is an open form');

  await fillIn(emberFormForFind('Name'), 'foo');
  await click(find('form button'));
  assert.ok(true, 'It was possible to fill in form and submit it for processing');

  let tableCells = find('table tr td');
  assert.equal('Bubu', tableCells[1].innerText, 'Name of the ACL user is correctly preserved');
  assert.equal('foo', tableCells[4].innerText, 'Name of the ACL user is correctly set');

  await click(find('table tr td span.delete-attr:first'));

  andThen(() => {
    tableCells = find('table tr td');
    assert.equal(1 * 3, tableCells.length, 'User was removed from the ACL role');
  });
});
