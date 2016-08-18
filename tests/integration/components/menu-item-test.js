import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('menu-item', 'Integration | Component | menu item', {
  integration: true
});

test('render title', function(assert) {
  assert.expect(2);

  this.render(hbs`{{menu-item title='Hello'}}`);
  assert.ok(this.$('.menu-item').text().indexOf('Hello') > -1, 'Title is rendered');

  this.render(hbs`{{menu-item title='World'}}`);
  assert.ok(this.$('.menu-item').text().indexOf('World') > -1, 'Title is rendered');
});

test('render title and status', function(assert) {
  assert.expect(2);

  this.render(hbs`{{menu-item title='World' status='offline'}}`);
  assert.ok(this.$('.menu-item').text().indexOf('[offline]') > -1, 'Status is rendered');

  this.render(hbs`{{menu-item title='World' status='online'}}`);
  assert.ok(this.$('.menu-item').text().indexOf('[online]') > -1, 'Status is rendered');
});

test('Selected item should propagate ID to closure', function(assert) {
  assert.expect(3);

  this.set('onClick', (componentId) => {
    assert.ok(true, 'Closure action after click on item was executed');
    assert.equal(componentId, 'menu:Foo', 'Component ID is sent to the onClickAction');
  });

  this.render(hbs`{{menu-item title='Hello' componentId='menu:Foo' onClickAction=(action onClick)}}`);

  const $button = this.$('.menu-item');
  assert.equal($button.length, 1, 'There is just one "button" to click on');
  $button.click();
});

test('Collapsability of menu item', function(assert) {
  assert.expect(4);

  this.render(hbs`{{menu-item title='Hello'}}`);
  assert.ok(this.$('.menu-item').text().indexOf('+') === -1, 'Plus sign is not rendered because item is not collapsable');
  assert.ok(this.$('.menu-item').text().indexOf('-') === -1, 'Minus sign is not rendered because item is not collapsable');

  this.render(hbs`{{menu-item title='Hello' isCollapsable=true}}`);
  assert.ok(this.$().text().indexOf('+') > -1, 'Plus sign is rendered because item is collapsable');

  this.render(hbs`{{menu-item title='Hello' isCollapsable=true isCollapsed=false}}`);
  assert.ok(this.$().text().indexOf('-') > -1, 'Minus sign is rendered because item is collapsable');
});

test('Collapsing/Uncollapsing menu item with +/-', function(assert) {
  assert.expect(4);

  this.render(hbs`{{menu-item title='Hello' isCollapsable=true}}`);
  assert.ok(this.$().text().indexOf('+') > -1, 'Plus sign is rendered because item is collapsable');
  const $button = this.$('.menu-item-collapse');
  assert.equal($button.length, 1, 'There is just one collapse "button" to click on');
  $button.click();
  assert.ok(this.$().text().indexOf('-') > -1, 'Minus sign is rendered because item is collapsable');
  $button.click();
  assert.ok(this.$().text().indexOf('+') > -1, 'Plus sign is rendered because item is collapsable');
});

test('Collapsing/Uncollapsing menu item with clicking on text', function(assert) {
  assert.expect(6);

  this.set('onClick', () => {
    assert.ok(true, 'Closure action after click on item was executed');
  });

  this.render(hbs`{{menu-item title='Hello' componentId='menu:Foo' onClickAction=(action onClick) isCollapsable=true}}`);

  assert.ok(this.$().text().indexOf('+') > -1, 'Plus sign is rendered because item is collapsable');
  const $button = this.$('.menu-item');
  assert.equal($button.length, 1, 'There is just one collapse "button" to click on');
  $button.click();
  assert.ok(this.$().text().indexOf('-') > -1, 'Minus sign is rendered because item is collapsable');
  $button.click();
  assert.ok(this.$().text().indexOf('+') > -1, 'Plus sign is rendered because item is collapsable');
});

test('Show content if item is not collapsed', function(assert) {
  assert.expect(2);

  this.render(hbs`{{#menu-item title='Hello' componentId='menu:Foo' isCollapsable=true}}Bar{{/menu-item}}`);
  assert.ok(this.$().text().indexOf('Bar') === -1, 'Content is not rendered because item is collapsabled');

  this.render(hbs`{{#menu-item title='Hello' componentId='menu:Foo' isCollapsable=true isCollapsed=false}}Bar{{/menu-item}}`);
  assert.ok(this.$().text().indexOf('Bar') > -1, 'Content is rendered because item is not collapsabled');
});

test('Checkox should propagate ID to closure', function(assert) {
  assert.expect(4);

  this.set('onCheck', (componentId, checkboxValue) => {
    assert.ok(true, 'Closure action after click on checkbox was executed');
    assert.equal(checkboxValue, true, 'Checkbox is checked');
    assert.equal(componentId, 'menu:Foo', 'Component ID is sent to the onClickAction');
  });

  this.render(hbs`{{menu-item title='Hello' componentId='menu:Foo' onCheckAction=(action onCheck)}}`);

  const $button = this.$(':checkbox');
  assert.equal($button.length, 1, 'There is just one checkbox to click on');
  $button.click();
});
