import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import createMenuItems from '../../helpers/create-menu-items';

moduleForComponent('menu-list', 'Integration | Component | menu list', {
  integration: true
});

test('Show X menu items from data when there are no children', function(assert) {
  assert.expect(2);

  this.set('onClick', () => { });
  this.set('onCheck', () => { });

  let ITEMS_COUNT = 2;
  this.set('menuItems', createMenuItems(ITEMS_COUNT));
  this.render(hbs`{{menu-list data=menuItems onClickAction=(action onClick) onCheckAction=(action onCheck)}}`);
  assert.equal(this.$('li').length, ITEMS_COUNT, 'Count of item matches model');

  ITEMS_COUNT = 5;
  this.set('menuItems', createMenuItems(ITEMS_COUNT));
  this.render(hbs`{{menu-list data=menuItems onClickAction=(action onClick) onCheckAction=(action onCheck)}}`);
  assert.equal(this.$('li').length, ITEMS_COUNT, 'Count of item matches model');
});

test('Show X menu items from data with few children', function(assert) {
  assert.expect(8);

  const ITEMS_COUNT = 2;
  const CHILDREN_COUNT = 3;
  this.set('menuItems', createMenuItems(ITEMS_COUNT, 0, CHILDREN_COUNT));

  this.set('onClick', () => { });
  this.set('onCheck', () => {
    assert.ok(true, 'onCheck function was called as expected');
  });

  this.render(hbs`{{menu-list data=menuItems onClickAction=(action onClick) onCheckAction=(action onCheck)}}`);
  assert.equal(this.$('li').length, ITEMS_COUNT, 'Count of item matches model');
  assert.equal(this.$('ul').length, 0, 'There should be expanded items');

  // click on first menu item what lead to expansion and presenting children of that element
  const $button = this.$('.menu-item-collapse:eq(0)');
  assert.equal($button.length, 1, 'There is just one "button" to click on');
  $button.click();

  assert.equal(this.$('ul').length, 1, 'There should be one expanded item');
  assert.equal(this.$('li').length, ITEMS_COUNT + CHILDREN_COUNT, 'Count of item and its children matches model');

  $button.click();
  assert.equal(this.$('li').length, ITEMS_COUNT, 'Count of item matches model');
  assert.equal(this.$('ul').length, 0, 'There should be expanded items');

  // Click on the checkbox that should call action
  const $checkBox = this.$(':checkbox:eq(0)');
  $checkBox.click();
  });
