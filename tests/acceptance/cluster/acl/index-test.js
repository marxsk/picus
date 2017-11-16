import { test, skip } from 'qunit';
import moduleForAcceptance from 'picus/tests/helpers/module-for-acceptance';
import defaultScenario from '../../../../mirage/scenarios/default';
import startApp from '../../../helpers/start-app';
import Ember from 'ember';

var application;

let mockTickTock = Ember.Service.extend({
    now: 111,
});

moduleForAcceptance('Acceptance | cluster/acl/index', {
  beforeEach: function() {
    server.shutdown();

    application = startApp();
    application.register('service:mockTickTock', mockTickTock);
    application.inject('service:store', 'ticktock', 'service:mockTickTock');

    defaultScenario(server);
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});


test('visiting /cluster/CLUSTERID/acl', function(assert) {
  visit('/cluster/my/acl');

  andThen(function() {
    assert.equal(currentURL(), '/cluster/my/acl', 'URL exists');
  });
});

// @note: this should be test for navigation tabs; it does not test functionality of this page
test('visiting /cluster/CLUSTERID/acl with specified tab and changing active tab', async function(assert) {
  await visit('/cluster/my/acl?tab=roles');
  assert.equal(currentURL(), '/cluster/my/acl?tab=roles');

  assert.equal(1, find('div#roles').length, 'There should be one tab with "Roles" as id');
  const rolesTab = find('div#roles')[0];
  assert.ok(rolesTab.classList.contains('active'), 'Tab "Roles" is active');

  const permTab = find('ul.nav-tabs li a');
  await click(permTab[2]);
  assert.equal(currentURL(), '/cluster/my/acl?tab=permissions', 'The URL was changed after clicking on a different tab');
});

test('create an ACL role with name and description', async function(assert) {
  await visit('/cluster/my/acl?tab=roles');
  assert.equal(find('label.form-field--label').length, 0, 'There are no open forms');
  await click('button:first');
  assert.ok(find('label.form-field--label').length > 0, 'There is an open form');

  const formFields = find('form div.form-group input');

  await fillIn(formFields[0], 'hugo');
  await fillIn(formFields[1], 'description of hugo');

  await click(find('form button'));
  assert.ok(true, 'It was possible to fill in form and submit it for processing');

  const tableCells = find('table tr td');
  assert.equal('hugo', tableCells[1].innerText, 'Name of the ACL role is correctly set');
  assert.equal('description of hugo', tableCells[2].innerText, 'Description of the ACL role is correctly set');

  andThen(function() {
    Ember.run.later(function() {
      // code here will execute within a RunLoop in about 500ms with this == myContext
      assert.ok(find('table tr td a')[0].href.endsWith('/cluster/my/acl/role/hugo'), 'ACL role have ID from server, so it has to be clickable');
    }, 1000);
  })
});

skip('@todo: add tests for warnings in the form', function(assert) {});
skip('@todo: add tests for notification popus after clicking on the button', function(assert) {});
