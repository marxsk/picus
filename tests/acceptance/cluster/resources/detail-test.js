import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'picus/tests/helpers/module-for-acceptance';
import defaultScenario from 'picus/mirage/scenarios/default';
import startApp from 'picus/tests/helpers/start-app';

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


test('add meta attribute', async (assert) => {
  defaultScenario(server);

  await visit('/cluster/my/resources/show/resource-ping?tab=attributes');
  await click(find('h4')[0]);
  await click('button:eq(13)');

  await fillIn(emberFormForFind('Key'), 'foo');
  await fillIn(emberFormForFind('Value'), 'bar');

  assert.equal(
    find('button')[14].outerText,
    'Add',
    'Validation do not block submitting of the form',
  );

  await click('button:eq(14)');
});
