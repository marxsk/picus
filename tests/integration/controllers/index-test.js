import { moduleFor } from 'ember-qunit';
// import { test } from 'ember-qunit';
import { skip } from 'qunit';
import Ember from 'ember';
// import startApp from '../../helpers/start-app';

let application;
let store;
const RELOAD_TIMEOUT = 1000;

moduleFor('controller:index', 'Integration | Controller | index', {
  needs: ['model:node', 'model:resource'],
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

skip('check if selected component is Node', function (assert) {
  assert.expect(3);

  const controller = this.subject();

  Ember.run.later(() => {
    const node = store.createRecord('node', { name: 'Only node' });
    const resource = store.createRecord('resource', { name: 'My Resource' });

    controller.set('selectedComponent', node);
    assert.equal(true, controller.get('isSelectedNode'), 'Select node is a real Node');

    controller.set('selectedComponent', resource);
    assert.equal(false, controller.get('isSelectedNode'), 'Select node is a Resource, not a Node');

    controller.set('selectedComponent', undefined);
    assert.equal(false, controller.get('isSelectedNode'), 'There is nothing selected');
  }, RELOAD_TIMEOUT);

  application.testHelpers.wait();
});
