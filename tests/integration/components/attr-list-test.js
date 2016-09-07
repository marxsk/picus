import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('attr-list', 'Integration | Component | attr list', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  let attrs = Ember.A();
  attrs.pushObject(Ember.Object.create({
    id: 123,
    isDeleted: false,
    key: 'foo',
    value: 'bar',
  }));
  attrs.pushObject(Ember.Object.create({
    id: 125,
    isDeleted: false,
    key: 'master',
    value: 'slave',
  }));

  this.set('myAttrs', attrs);
  this.set('onDelete', () => { });
  this.set('onAppend', () => { });
  this.set('onMultiple', () => { });

  this.render(hbs`{{attr-list title='Hugo Hugo' attributes=myAttrs onDeleteAction=(action onDelete) onAppendAction=(action onAppend) onDeleteMultipleAction=(action onMultiple)}}`);
  assert.ok(this.$().text().indexOf('Hugo Hugo') > -1, 'Title has to be shown in the component');
  assert.equal((2+1), this.$('tr').length, 'There should be one line in addition to number of attributes');
});

test('check if actions are propagated to children', function(assert) {
  assert.expect(4);

  let attrs = Ember.A();
  attrs.pushObject(Ember.Object.create({
    id: 123,
    isDeleted: false,
    key: 'foo',
    value: 'bar',
  }));
  attrs.pushObject(Ember.Object.create({
    id: 125,
    isDeleted: false,
    key: 'master',
    value: 'slave',
  }));

  this.set('myAttrs', attrs);
  this.set('onDelete', () => { assert.ok(true, 'Delete action was called'); });
  this.set('onAppend', () => { assert.ok(true, 'Append action was called'); });
  this.set('onMultiple', () => { });

  this.render(hbs`{{attr-list title='Hugo Hugo' attributes=myAttrs onDeleteAction=(action onDelete) onAppendAction=(action onAppend) onDeleteMultipleAction=(action onMultiple)}}`);

  let $button = this.$('.delete-attr');
  assert.equal($button.length, 2, 'There are two "buttons" with delete action');
  $button[0].click();

  $button = this.$('.append-attr');
  assert.equal($button.length, 1, 'There is just one "button" with append action');
  $button.click();
});

test('check if fields are emptied after append action', function(assert) {
  assert.expect(6);

  let attrs = Ember.A();
  this.set('myAttrs', attrs);
  this.set('onDelete', () => { assert.ok(undefined, 'Delete action was called and it should not'); });
  this.set('onMultiple', () => { });
  this.set('onAppend', (key, value) => {
    assert.ok(true, 'Append action was called');
    assert.equal(key, 'My First Key', 'Content of "key" was obtained from input box');
    assert.equal(value, 'Value of key', 'Content of "value" was obtained from input box');
  });

  this.render(hbs`{{attr-list title='Hugo Hugo' attributes=myAttrs onDeleteAction=(action onDelete) onAppendAction=(action onAppend) onDeleteMultipleAction=(action onMultiple)}}`);
  let $button = this.$('.append-attr');
  assert.equal($button.length, 1, 'There is just one "button" with append action');

  let $input1 = this.$('input:eq(0)');
  $input1.val('My First Key');
  $input1.change();

  let $input2 = this.$('input:eq(1)');
  $input2.val('Value of key');
  $input2.change();

  $button.click();

  assert.equal($input1.val(), '', 'After click on button, inputboxes should be empty');
  assert.equal($input2.val(), '', 'After click on button, inputboxes should be empty');
});
