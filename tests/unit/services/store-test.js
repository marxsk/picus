import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';
import startApp from '../../helpers/start-app';

var application;
var store;
const RELOAD_TIMEOUT = 1000;

moduleFor('service:store', 'Unit | Service | store', {
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
  assert.expect(2);
  const CLUSTER_COUNT = 3;

  server.createList('cluster', CLUSTER_COUNT);

  store.reloadData();
  Ember.run.later(function() {
    assert.equal(CLUSTER_COUNT, store.peekAll('cluster').get('length'), 'invalid number of loaded clusters');
  }, RELOAD_TIMEOUT);

  application.testHelpers.wait();
  store.reloadData();
  Ember.run.later(function() {
    assert.equal(CLUSTER_COUNT, store.peekAll('cluster').get('length'), 'invalid number of loaded clusters after reloading model');
  }, RELOAD_TIMEOUT);

  return application.testHelpers.wait();
});

test('load one cluster with several nodes [added in constructor]', function(assert) {
  assert.expect(2);
  const NODES_COUNT = 3;

  let nodes = server.createList('node', NODES_COUNT);
  let cluster = server.create('cluster', {nodes});
  cluster.save();

  store.reloadData();
  Ember.run.later(function() {
    assert.ok(store.peekAll('cluster').get('firstObject'), 'loading of first cluster object from store');

    assert.equal(NODES_COUNT, store.peekAll('cluster').get('firstObject').get('nodes').get('length'), 'invalid number of loaded nodes for first cluster');
    store.reloadData();
  }, RELOAD_TIMEOUT);

  return application.testHelpers.wait();
});

test('load one cluster with several nodes [added using createNode]', function(assert) {
  assert.expect(2);
  const NODES_COUNT = 3;

  let cluster = server.create('cluster');
  for (let x=0; x<NODES_COUNT; x++) {
    cluster.createNode();
  }
  cluster.save();

  store.reloadData();
  Ember.run.later(function() {
    assert.ok(store.peekAll('cluster').get('firstObject'), 'loading of first cluster object from store');

    assert.equal(NODES_COUNT, store.peekAll('cluster').get('firstObject').get('nodes').get('length'), 'invalid number of loaded nodes for first cluster');
    store.reloadData();
  }, RELOAD_TIMEOUT);

  return application.testHelpers.wait();
});

test('load one cluster with several resources', function(assert) {
  assert.expect(1);
  const CLUSTER_COUNT = 1;
  const RESOURCES_COUNT = 3;

  server.createList('cluster', CLUSTER_COUNT);

  store.reloadData();
  Ember.run.later(function() {
    assert.equal(RESOURCES_COUNT, store.peekAll('cluster').get('firstObject').get('nodes').get('length'), 'invalid number of loaded resources for first cluster');
  }, RELOAD_TIMEOUT);

  return application.testHelpers.wait();
});

test('periodic reloading', function(assert) {
  assert.ok(false);
});
