import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import createMenuItems from '../../helpers/create-menu-items';

moduleForComponent('menu-header', 'Integration | Component | menu header', {
  integration: true,
});

test('render title', function (assert) {
  assert.expect(2);

  this.render(hbs`{{menu-header title='Hello'}}`);
  assert.ok(
    this.$('.menu-header')
      .text()
      .indexOf('Hello') > -1,
    'Title is rendered',
  );

  this.render(hbs`{{menu-header title='World'}}`);
  assert.ok(
    this.$('.menu-header')
      .text()
      .indexOf('World') > -1,
    'Title is rendered',
  );
});

test('Show content - yield', function (assert) {
  assert.expect(4);

  this.render(hbs`{{#menu-header title='Hello' componentId='menu:Foo'}}Bar{{/menu-header}}`);
  assert.ok(
    this.$()
      .text()
      .indexOf('Bar') === -1,
    'Content is not rendered because header is collapsabled',
  );

  this.render(hbs`{{#menu-header title='Hello' componentId='menu:Foo' isCollapsed=false}}Bar{{/menu-header}}`);
  assert.ok(
    this.$()
      .text()
      .indexOf('Bar') > -1,
    'Content is rendered because header is not collapsabled',
  );

  const $button = this.$('.menu-header');
  assert.equal($button.length, 1, 'There is just one collapse "button" to click on');
  $button.click();
  assert.ok(
    this.$()
      .text()
      .indexOf('Bar') === -1,
    'Content is not rendered because header is collapsabled',
  );
});

test('Show content - data', function (assert) {
  assert.expect(5);

  let ITEMS_COUNT = 2;
  const CHILDREN_COUNT = 3;
  this.set('menuItems', createMenuItems(ITEMS_COUNT, 0, CHILDREN_COUNT));
  this.set('onClick', () => {});
  this.set('onCheck', () => {});

  this.render(hbs`{{menu-header title='Hello' componentId='menu:Foo' data=menuItems}}`);
  assert.equal(this.$('li').length, 0, 'Content is not rendered because header is collapsabled');

  this.render(hbs`{{menu-header title='Hello' componentId='menu:Foo' data=menuItems onCheckAction=(action onCheck) onClickAction=(action onClick) isCollapsed=false}}`);
  assert.equal(
    this.$('li').length,
    ITEMS_COUNT,
    'Content is rendered because header is not collapsabled',
  );

  const $button = this.$('.menu-header');
  assert.equal($button.length, 1, 'There is just one collapse "button" to click on');
  $button.click();
  assert.equal(this.$('li').length, 0, 'Content is not rendered because header is collapsabled');

  ITEMS_COUNT = 3;
  this.set('menuItems', createMenuItems(ITEMS_COUNT));
  this.render(hbs`{{menu-header title='Hello' componentId='menu:Foo' data=menuItems isCollapsed=false onCheckAction=(action onCheck) onClickAction=(action onClick)}}`);
  assert.equal(
    this.$('li').length,
    ITEMS_COUNT,
    'Content is rendered because header is not collapsabled',
  );
});

test('Show error count if there are any errors', function (assert) {
  assert.expect(2);

  const ITEMS_COUNT = 5;
  const ERRORS_COUNT = 3;
  this.set('menuItems', createMenuItems(ITEMS_COUNT, ERRORS_COUNT));

  this.render(hbs`{{menu-header title='Hello' componentId='menu:Foo' data=menuItems}}`);
  assert.equal(
    this.$('.errors-count')
      .text()
      .trim(),
    `[${ERRORS_COUNT}]`,
    'Count of errors is rendered as expected',
  );

  this.set('cleanItems', createMenuItems(ITEMS_COUNT));
  this.render(hbs`{{menu-header title='Hello' componentId='menu:Foo' data=cleanItems}}`);
  assert.equal(
    this.$('.errors-count')
      .text()
      .trim(),
    '',
    'Count of errors is not rendered because there are no errors',
  );
});

test('Display only items that are in error state', function (assert) {
  assert.expect(6);

  const ITEMS_COUNT = 5;
  const ERRORS_COUNT = 3;
  this.set('menuItems', createMenuItems(ITEMS_COUNT, ERRORS_COUNT));
  this.set('onClick', () => {});
  this.set('onCheck', () => {});

  this.render(hbs`{{menu-header title='Hello' componentId='menu:Foo' data=menuItems onCheckAction=(action onCheck) onClickAction=(action onClick)}}`);

  const $button = this.$('.errors-count');
  assert.equal($button.length, 1, 'There is just one error filtering "button" to click on');
  $button.click();
  assert.equal(this.$('li').length, ERRORS_COUNT, 'Count of failed item matches model');
  // In this case, clicking should not hide failed items
  $button.click();
  assert.equal(this.$('li').length, ERRORS_COUNT, 'Count of failed item matches model');

  // Click on the normal collapse should always show everything if only errors were visible
  const $collapse = this.$('.menu-header');
  assert.equal($collapse.length, 1, 'There is just one collapse "button" to click on');
  $collapse.click();
  assert.equal(this.$('li').length, ITEMS_COUNT, 'Every item is visible after onlyErrors');
  $collapse.click();
  assert.equal(this.$('li').length, 0, 'Header is collapsed so there should be no content');
});
