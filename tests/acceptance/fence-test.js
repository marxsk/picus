import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'picus/tests/helpers/module-for-acceptance';
import defaultScenario from '../../mirage/scenarios/default';
import startApp from '../helpers/start-app';

let application;

const mockTickTock = Ember.Service.extend({
  now: 111,
});

moduleForAcceptance('Acceptance | /fence', {
  beforeEach() {
    server.shutdown();

    application = startApp();
    application.register('service:mockTickTock', mockTickTock);
    application.inject('service:store', 'ticktock', 'service:mockTickTock');
  },
  afterEach() {
    Ember.run(application, 'destroy');
  },
});

test('visiting /cluster/my/fences/show/Fence-01?tab=properties', (assert) => {
  defaultScenario(server);

  visit('/cluster/my/fences/show/Fence-01?tab=properties');

  andThen(() => {
    assert.equal(currentURL(), '/cluster/my/fences/show/Fence-01?tab=properties');
  });
});

test('update required field in the form', async (assert) => {
  defaultScenario(server);
  await visit('/cluster/my/fences/show/Fence-01?tab=properties');

  await fillIn(emberFormForFind('Physical plug number, name of virtual machine or UUID'), '99');
  assert.ok(true, 'Label "physical plug number" was found as expected');

  const submitButton = find('button.form-button--submit')[0];
  assert.equal('Update', submitButton.innerText.trim());
  await click(find('button.form-button--submit')[0]);
  assert.ok(true, 'Update was sent to the back-end');
});

test('switch prefilled form to internal names', async (assert) => {
  defaultScenario(server);
  await visit('/cluster/my/fences/show/Fence-01?tab=properties');

  await fillIn(emberFormForFind('Physical plug number, name of virtual machine or UUID'), '99');
  assert.equal(find('input')[3].value, 99, 'Plug field is correctly filled');
  // switch from human-readable to internal-names of properties
  await click(find('div.x-toggle-btn')[0]);
  assert.equal(find('input')[3].value, 99, 'Plug field is correctly filled');
});
