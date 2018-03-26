import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'picus/tests/helpers/module-for-acceptance';
import defaultScenario from 'picus/mirage/scenarios/default';
import startApp from 'picus/tests/helpers/start-app';
import { selectChoose } from 'ember-power-select/test-support/helpers';

let application;

const mockTickTock = Ember.Service.extend({
  now: 111,
});

moduleForAcceptance('Acceptance | cluster/resources/detail`', {
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

test('visiting /cluster/resources/detail', (assert) => {
  defaultScenario(server);
  visit('/cluster/my/resources/show/MyMock-01');

  andThen(() => {
    assert.equal(currentURL(), '/cluster/my/resources/show/MyMock-01');
  });
});

test('visiting /cluster/resources/does-not-exist', async (assert) => {
  defaultScenario(server);
  await visit('/cluster/my/resources/show/does-not-exist');

  assert.equal(currentURL(), '/cluster/my/resources/show/does-not-exist');
});

test('add resource ordering preference', async (assert) => {
  defaultScenario(server);

  await visit('/cluster/my/resources/show/resource-ping?tab=constraints');
  await click(find('h4')[5]);
  await click(find('button')[8]);

  await selectChoose(emberFormForFind('Target Resource'), 'MyMock-01');
  await fillIn(emberFormForFind('Score'), 222);

  assert.equal(
    find('button')[9].outerText,
    'Add',
    'Validation do not block submitting of the form',
  );
});
