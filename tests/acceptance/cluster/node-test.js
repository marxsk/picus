import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'picus/tests/helpers/module-for-acceptance';
import defaultScenario from 'picus/mirage/scenarios/default';
import startApp from 'picus/tests/helpers/start-app';

let application;

const mockTickTock = Ember.Service.extend({
  now: 111,
});

moduleForAcceptance('Acceptance | cluster/my/*`', {
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

test('visiting /cluster/nodes', (assert) => {
  defaultScenario(server);
  visit('/cluster/my/nodes');

  andThen(() => {
    assert.equal(currentURL(), '/cluster/my/nodes');
  });
});

test('visiting /cluster/fences', (assert) => {
  defaultScenario(server);
  visit('/cluster/my/fences');

  andThen(() => {
    assert.equal(currentURL(), '/cluster/my/fences');
  });
});
