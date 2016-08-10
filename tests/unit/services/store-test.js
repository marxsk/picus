import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';
import startApp from '../../helpers/start-app';

var application;
var store;

moduleFor('service:store', 'Unit | Service | store', {
  // Specify the other units that are required for this test.
  needs: ['model:cluster'],
  beforeEach: function() {
    application = startApp();
    store = application.__container__.lookup('service:store');
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('it exists', function(assert) {
  assert.ok(this.subject());
});

test('check reloading function', function(assert) {
  assert.expect(0);
  store.reloadData();
});

test('load empty clusters', function(assert) {
  // @todo should we count also asserts in setTimeout?
  assert.expect(1);
  const RELOAD_TIMEOUT = 1000;
  const CLUSTER_COUNT = 3;

  server.createList('cluster', CLUSTER_COUNT);

  store.reloadData();
  setTimeout(function() {
    assert.equal(CLUSTER_COUNT, store.peekAll('cluster').get('length'));
  }, RELOAD_TIMEOUT);
});
