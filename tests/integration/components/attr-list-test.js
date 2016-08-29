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

  this.render(hbs`{{attr-list title='Hugo Hugo' attributes=myAttrs onDeleteAction=(action onDelete) onAppendAction=(action onAppend)}}`);
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
  this.set('onDelete', () => { assert.ok(true, 'Delete action was called')});
  this.set('onAppend', () => { assert.ok(true, 'Append action was called')});

  this.render(hbs`{{attr-list title='Hugo Hugo' attributes=myAttrs onDeleteAction=(action onDelete) onAppendAction=(action onAppend)}}`);

  let $button = this.$('.delete-attr');
  assert.equal($button.length, 2, 'There are two "buttons" with delete action');
  $button[0].click();

  $button = this.$('.append-attr')
  assert.equal($button.length, 1, 'There is just one "button" with append action');
  $button.click();
});
