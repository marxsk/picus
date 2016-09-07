import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('attr-single', 'Integration | Component | attr single', {
  integration: true,
});

test('render usual attribute', function(assert) {
  assert.expect(3);

  const attr = Ember.Object.create({
    id: 123,
    isDeleted: false,
    key: 'foo',
    value: 'bar',
  });

  this.set('myAttr', attr);
  this.set('onDelete', () => { });
  this.render(hbs`{{attr-single attribute=myAttr onDeleteAction=(action onDelete)}}`);

  assert.equal(this.$('tr td:nth-child(2)').text(), 'foo');
  assert.equal(this.$('tr td:nth-child(3)').text(), 'bar');
  assert.equal(this.$('tr td:nth-child(4)').text().trim(), 'DELETE');
});

test('render attribute after marking as deleted', function(assert) {
  assert.expect(1);

  const attr = Ember.Object.create({
    id: 123,
    isDeleted: true,
    key: 'foo',
    value: 'bar',
  });

  this.set('myAttr', attr);
  this.set('onDelete', () => { });
  this.render(hbs`{{attr-single attribute=myAttr onDeleteAction=(action onDelete)}}`);

  assert.equal(this.$('tr td:nth-child(4)').text().trim(), '[DELETING]');
});

test('render new attribute which is not in backend yet', function(assert) {
  assert.expect(1);

  const attr = Ember.Object.create({
    id: undefined,
    isDeleted: false,
    key: 'foo',
    value: 'bar',
  });

  this.set('myAttr', attr);
  this.set('onDelete', () => { });
  this.render(hbs`{{attr-single attribute=myAttr onDeleteAction=(action onDelete)}}`);

  assert.equal(this.$('tr td:nth-child(4)').text().trim(), '[ADDING]');
});

test('test if action to delete attribute was called', function(assert) {
  assert.expect(2);

  const attr = Ember.Object.create({
    id: 123,
    isDeleted: false,
    key: 'foo',
    value: 'bar',
  });

  this.set('myAttr', attr);
  this.set('onAttrDelete', (attr) => {
    assert.equal(123, attr.get('id'));
  });
  this.render(hbs`{{attr-single attribute=myAttr onDeleteAction=(action onAttrDelete)}}`);
  const $button = this.$('.delete-attr');
  assert.equal($button.length, 1, 'There is just one "button" to click on');
  $button.click();
});

test('test if change on checkbox call action', function(assert) {
  assert.expect(2);

  const attr = Ember.Object.create({
    id: 123,
    isDeleted: false,
    key: 'foo',
    value: 'bar',
  });

  this.set('myAttr', attr);
  this.set('onAttrDelete', () => { });
  this.set('onCheck', (attr) => {
    assert.equal(123, attr.get('id'));
  });
  this.render(hbs`{{attr-single attribute=myAttr onCheckAction=(action onCheck) onDeleteAction=(action onAttrDelete)}}`);
  const $button = this.$(':checkbox');
  assert.equal($button.length, 1, 'There is just one "checkbox" to click on');
  $button.click();
});
