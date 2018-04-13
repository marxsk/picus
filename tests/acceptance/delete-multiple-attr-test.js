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
  defaultScenario(server);

  await visit('/cluster/my/nodes/show/virtual01?tab=attributes');

  let tableCells = find('table tr td');
  assert.equal('util attr #99', tableCells[1].innerText, 'First attribute exists as expected');

  await click(find('table tr td input')[0]);
  await click(find('span.delete-attrs')[0]);

  tableCells = find('table tr td');
  assert.equal(0, tableCells.length, 'First attribute was removed');

  assert.equal(currentURL(), '/cluster/my/nodes/show/virtual01?tab=attributes');
});
