import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'picus/tests/helpers/module-for-acceptance';
import defaultScenario from '../../mirage/scenarios/default';
import startApp from '../helpers/start-app';

let application;

const mockTickTock = Ember.Service.extend({
  now: 111,
});

moduleForAcceptance('Acceptance | delete multiple attributes', {
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

test('Delete selected on node attributes', async (assert) => {
  let tableCells;
  defaultScenario(server);

  await visit('/cluster/my/nodes/show/virtual01?tab=attributes');

  andThen(() => {
    tableCells = find('table tr td');
    assert.equal('attr #1', tableCells[1].innerText, 'First attribute exists as expected');
  });

  await click(find('table tr td input')[0]);
  await click(find('span.delete-attrs')[0]);

  andThen(() => {
    tableCells = find('table tr td');
    assert.equal('attr #2', tableCells[1].innerText, 'First attribute was removed');
  });

  // nothing should happend as selection should be empty
  await click(find('span.delete-attrs')[0]);

  // delete also utilization attribute
  await click(find('table tr td input')[1]);
  await click(find('span.delete-attrs')[1]);

  assert.ok(true, 'It was possible to delete attribute from different table');

  andThen(() => {
    assert.equal(currentURL(), '/cluster/my/nodes/show/virtual01?tab=attributes');
  });
});
