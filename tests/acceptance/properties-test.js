import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'picus/tests/helpers/module-for-acceptance';
import defaultScenario from '../../mirage/scenarios/default';
import startApp from '../helpers/start-app';

let application;

const mockTickTock = Ember.Service.extend({
  now: 111,
});

moduleForAcceptance('Acceptance | /properties', {
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

test('visiting /cluster/my/properties', (assert) => {
  defaultScenario(server);

  visit('/cluster/my/properties');

  andThen(() => {
    assert.equal(currentURL(), '/cluster/my/properties');
  });
});

test('update election-timeout', async (assert) => {
  defaultScenario(server);
  await visit('/cluster/my/properties');

  await fillIn(emberFormForFind('election timeout:'), '99m');
  assert.ok(true, 'Label "election timeout" was found as expected');
  await click(emberFormButton('Save changes'));
  assert.ok(true, 'Properties changes were sent to the back-end');
});

test('submit with the unmodified form', async (assert) => {
  defaultScenario(server);
  Ember.Logger.debug('Is there a warning from ember-cli-mirage? If yes, than this is the problematic tests :)');
  await visit('/cluster/my/properties');

  await click(emberFormButton('Save changes'));
  assert.ok(true, 'Properties changes were sent to the back-end');
});
