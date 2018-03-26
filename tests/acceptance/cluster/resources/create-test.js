import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'picus/tests/helpers/module-for-acceptance';
import defaultScenario from 'picus/mirage/scenarios/default';
import startApp from 'picus/tests/helpers/start-app';

let application;

const mockTickTock = Ember.Service.extend({
  now: 111,
});

moduleForAcceptance('Acceptance | cluster/resources/create', {
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

test('visiting /cluster/resources/create', (assert) => {
  defaultScenario(server);
  visit('/cluster/my/resources/create');

  andThen(() => {
    assert.equal(currentURL(), '/cluster/my/resources/create');
  });
});

test('change resource provider', async (assert) => {
  defaultScenario(server);
  await visit('/cluster/my/resources/create');

  const provider = emberFormForFind('Class/Providers');
  assert.ok(provider !== undefined, 'Labels in form are rendered as expected');

  await fillIn(provider, 'nagios');
  assert.ok(true, 'It was possible to change the provider');
});
