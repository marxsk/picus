import { moduleFor, test } from 'ember-qunit';
import { skip } from 'qunit';

moduleFor('controller:index', 'Unit | Controller | index', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});

test('check action onClick with component ID', function(assert) {
  assert.expect(4);

  let controller = this.subject();
  assert.equal(undefined, controller.get('selectedComponentId'), 'Initially, there is not a selected component');
  controller.actions.onClick.call(controller, undefined, 'menu:foo');
  assert.equal('menu:foo', controller.get('selectedComponentId'), 'Select a component that is not backed by real component');
  controller.actions.onClick.call(controller, 'abc', 'menu:foo');
  assert.equal('menu:foo', controller.get('selectedComponentId'), 'Select a component that is backed by real component');
  assert.equal('abc', controller.get('selectedComponent'), 'Select a component that is backed by real component');
});

test('check action onClick with component object', function(assert) {
  assert.expect(3);

  let controller = this.subject();
  assert.equal(undefined, controller.get('selectedComponent'), 'Initially, there is not a selected component');
  controller.actions.onClick.call(controller, undefined, 'menu:foo');
  assert.equal(undefined, controller.get('selectedComponent'), 'Select a component that is not backed by real component');
  controller.actions.onClick.call(controller, 'abc', 'menu:foo');
  assert.equal('abc', controller.get('selectedComponent'), 'Select a component that is backed by real component');
});

test('check existence of action onCheck', function(assert) {
  assert.expect(0);

  let controller = this.subject();
  controller.actions.onCheck.call(controller, 'menu:foo');
});

skip('check if selected component is Node', function(assert) {
  // @todo: Create records of given types to test it properly
  assert.expect(3);

  let controller = this.subject();
  let obj = undefined;

  controller.set('selectedComponent', obj);
  assert.equal(true, controller.get('isSelectedNode'), 'Select node is a real Node');
  assert.equal(false, controller.get('isSelectedNode'), 'Select node is a Resource, not a Node');

  controller.set('selectedComponent', undefined);
  assert.equal(false, controller.get('isSelectedNode'), 'There is no select node');
});
