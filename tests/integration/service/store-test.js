import { moduleFor } from 'ember-qunit';
// import { test } from 'ember-qunit';
import { skip } from 'qunit';
import Ember from 'ember';
// import startApp from '../../helpers/start-app';

let application;
let store;
const RELOAD_TIMEOUT = 1000;

moduleFor('service:store', 'Integration | Service | store', {
  needs: ['model:cluster'],
  /*  beforeEach: function() {
    application = startApp();
    store = application.__container__.lookup('service:store');
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
*/
});

skip('it exists', function (assert) {
  assert.ok(this.subject());
});

skip('check reloading function', (assert) => {
  assert.expect(0);
  store.reloadData();
});

skip('load empty clusters', (assert) => {
  assert.expect(2);
  const CLUSTER_COUNT = 3;

  server.createList('cluster', CLUSTER_COUNT);

  store.reloadData();
  Ember.run.later(() => {
    assert.equal(
      CLUSTER_COUNT,
      store.peekAll('cluster').get('length'),
      'invalid number of loaded clusters',
    );
  }, RELOAD_TIMEOUT);

  application.testHelpers.wait();
  store.reloadData();
  Ember.run.later(() => {
    assert.equal(
      CLUSTER_COUNT,
      store.peekAll('cluster').get('length'),
      'invalid number of loaded clusters after reloading model',
    );
  }, RELOAD_TIMEOUT);

  return application.testHelpers.wait();
});

skip('load one cluster with several nodes [added in constructor]', (assert) => {
  assert.expect(2);
  const NODES_COUNT = 3;

  const nodes = server.createList('node', NODES_COUNT);
  const cluster = server.create('cluster', { nodes });
  cluster.save();

  store.reloadData();
  Ember.run.later(() => {
    assert.ok(
      store.peekAll('cluster').get('firstObject'),
      'loading of first cluster object from store',
    );

    assert.equal(
      NODES_COUNT,
      store
        .peekAll('cluster')
        .get('firstObject')
        .get('nodes')
        .get('length'),
      'invalid number of loaded nodes for first cluster',
    );
    store.reloadData();
  }, RELOAD_TIMEOUT);

  return application.testHelpers.wait();
});

skip('load one cluster with several nodes [added using createNode]', (assert) => {
  assert.expect(2);
  const NODES_COUNT = 3;

  const cluster = server.create('cluster');
  for (let x = 0; x < NODES_COUNT; x += 1) {
    cluster.createNode();
  }
  cluster.save();

  store.reloadData();
  Ember.run.later(() => {
    assert.ok(
      store.peekAll('cluster').get('firstObject'),
      'loading of first cluster object from store',
    );

    assert.equal(
      NODES_COUNT,
      store
        .peekAll('cluster')
        .get('firstObject')
        .get('nodes')
        .get('length'),
      'invalid number of loaded nodes for first cluster',
    );
    store.reloadData();
  }, RELOAD_TIMEOUT);

  return application.testHelpers.wait();
});

skip('load one cluster with several resources [added in constructor]', (assert) => {
  assert.expect(2);
  const RESOURCES_COUNT = 3;

  const resources = server.createList('resource', RESOURCES_COUNT);
  const cluster = server.create('cluster', { resources });
  cluster.save();

  store.reloadData();
  Ember.run.later(() => {
    assert.ok(
      store.peekAll('cluster').get('firstObject'),
      'loading of first cluster object from store',
    );

    assert.equal(
      RESOURCES_COUNT,
      store
        .peekAll('cluster')
        .get('firstObject')
        .get('resources')
        .get('length'),
      'invalid number of loaded resources for first cluster',
    );
    store.reloadData();
  }, RELOAD_TIMEOUT);

  return application.testHelpers.wait();
});

skip('load one cluster with several resources [added using createNode]', (assert) => {
  assert.expect(2);
  const RESOURCES_COUNT = 3;

  const cluster = server.create('cluster');
  for (let x = 0; x < RESOURCES_COUNT; x += 1) {
    cluster.createResource();
  }
  cluster.save();

  store.reloadData();
  Ember.run.later(() => {
    assert.ok(
      store.peekAll('cluster').get('firstObject'),
      'loading of first cluster object from store',
    );

    assert.equal(
      RESOURCES_COUNT,
      store
        .peekAll('cluster')
        .get('firstObject')
        .get('resources')
        .get('length'),
      'invalid number of loaded resources for first cluster',
    );
    store.reloadData();
  }, RELOAD_TIMEOUT);

  return application.testHelpers.wait();
});

// Problem in mirage, when create* are used it works as expected.
skip('load resource with children resources [added in constructor]', (assert) => {
  assert.expect(3);

  const childResource = server.create('resource', { id: 1 });
  const mainResource = server.create('resource', { id: 2, resources: [childResource] });
  const cluster = server.create('cluster', { id: 3, resources: [mainResource] });
  cluster.save();

  store.reloadData();
  Ember.run.later(() => {
    assert.ok(
      store.peekAll('cluster').get('firstObject'),
      'loading of first cluster object from store',
    );
    assert.ok(
      store
        .peekAll('cluster')
        .get('firstObject')
        .get('resources')
        .get('firstObject'),
      'loading first resource from cluster',
    );
    assert.equal(
      1,
      store
        .peekAll('cluster')
        .get('firstObject')
        .get('resources')
        .get('firstObject')
        .get('resources')
        .get('length'),
    );
  }, RELOAD_TIMEOUT);

  return application.testHelpers.wait();
});

skip('load resource with children resources [added using createNode]', (assert) => {
  assert.expect(5);

  const cluster = server.create('cluster', { name: 'Second one' });
  const resource = cluster.createResource({ name: 'Apache Mock Server' });
  resource.createResource({ name: 'Child Mock' });
  resource.createResource({ name: 'Child Mock #2' });

  cluster.save();

  store.reloadData();
  Ember.run.later(() => {
    assert.ok(
      store.peekAll('cluster').get('firstObject'),
      'loading of first cluster object from store',
    );
    assert.ok(
      store
        .peekAll('cluster')
        .get('firstObject')
        .get('resources'),
      'load first resource in cluster',
    );
    assert.ok(
      store
        .peekAll('cluster')
        .get('firstObject')
        .get('resources')
        .get('firstObject')
        .get('resources'),
      'load children of first resource in cluster',
    );
    assert.equal(
      2,
      store
        .peekAll('cluster')
        .get('firstObject')
        .get('resources')
        .get('firstObject')
        .get('resources')
        .get('length'),
      'load first resource in cluster',
    );
    assert.equal(
      'Child Mock',
      store
        .peekAll('cluster')
        .get('firstObject')
        .get('resources')
        .get('firstObject')
        .get('resources')
        .get('firstObject')
        .get('name'),
      'check name of first children resource',
    );
  }, RELOAD_TIMEOUT);

  return application.testHelpers.wait();
});

skip('periodic reloading', (assert) => {
  assert.ok(false);
});

skip('only one request in queue for reloading', (assert) => {
  assert.ok(false);
});
