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
  assert.equal(2, this.$('tr').length, 'Number of lines should match number of attributes');
});

test('check if actions are propagated to children', function(assert) {
  assert.expect(3);

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
  this.set('onAppend', () => { });
  this.set('onMultiple', () => { });

  this.render(hbs`{{attr-list title='Hugo Hugo' attributes=myAttrs onDeleteAction=(action onDelete) onAppendAction=(action onAppend) onDeleteMultipleAction=(action onMultiple)}}`);

  let $button = this.$('.delete-attr');
  assert.equal($button.length, 2, 'There are two "buttons" with delete action');
  $button[0].click();

  $button = this.$('.append-attr');
  assert.equal($button.length, 0, 'There are no "buttons" with append action. Previously, they were there');
});
