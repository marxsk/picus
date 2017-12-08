import { moduleForComponent, test } from 'ember-qunit';
import { fillIn, keyEvent } from 'ember-native-dom-helpers';
import hbs from 'htmlbars-inline-precompile';
import { skip } from 'qunit';

moduleForComponent('filter-list', 'Integration | Component | filter list', {
  integration: true,
});

test('it renders nothing when there are no data', function (assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.render(hbs`{{filter-list}}`);
  assert.equal(
    this.$()
      .text()
      .trim(),
    '',
    'Data are not entered',
  );

  this.set('empty', []);
  this.render(hbs`{{filter-list data=empty}}`);
  assert.equal(
    this.$()
      .text()
      .trim(),
    '',
    'Data do not contain any record',
  );

  this.render(hbs`
    {{#filter-list}}
      template block text
    {{/filter-list}}
  `);
  assert.equal(
    this.$()
      .text()
      .trim(),
    '',
    'Inserted content was ignored',
  );
});

test('it renders single item', function (assert) {
  this.set('list', [{ title: 'first' }]);
  this.render(hbs`{{filter-list data=list}}`);
  assert.equal(
    this.$()
      .text()
      .trim(),
    'first',
    'Single item was rendered',
  );
});

test('it renders two items', function (assert) {
  this.set('list', [{ title: 'first' }, { title: 'second' }]);
  this.render(hbs`{{filter-list data=list}}`);
  assert.equal(this.$('li').length, 2, 'Two items were rendered');
});

test('it renders single item with defined titleKey', function (assert) {
  this.set('list', [{ name: 'first' }]);
  this.render(hbs`{{filter-list data=list titleKey='name'}}`);
  assert.equal(
    this.$()
      .text()
      .trim(),
    'first',
    'Single item was rendered',
  );
});

test('it renders single item with filter component', function (assert) {
  this.set('list', [{ title: 'first' }]);
  this.render(hbs`{{filter-list data=list showFilter=true}}`);
  assert.equal(this.$('div.input-group').length, 1, 'Filter component was rendered');
});

test('it filters records', async function (assert) {
  this.set('list', [{ title: 'first' }, { title: 'second' }]);
  this.render(hbs`{{filter-list data=list showFilter=true}}`);
  assert.equal(this.$('li').length, 2, 'Two items were rendered before filtering');

  const filterInput = this.$('input.form-control')[0];
  // @refactor: keyEvent should be enough
  await fillIn(filterInput, 'fir');
  await keyEvent(filterInput, 'keyup', 's');
  assert.equal(this.$('li').length, 1, 'One item was rendered after filtering');

  await fillIn('input', 'thir');
  await keyEvent(filterInput, 'keyup', 'd');
  assert.equal(this.$('li').length, 0, 'Empty list was rendered after filtering');
});

skip('it creates links to records', function (assert) {
  // @todo: it requires router to properly transform targetRoute to URL
  this.set('list', [{ title: 'first', id: '1' }, { title: 'second', id: '2' }]);
  this.render(hbs`{{filter-list data=list targetRoute='cluster.resources.show' idKey='id'}}`);

  assert.equal(this.$('a').length, 2, 'Links were created for every record');

  assert.equal(this.$('a')[0].href, '/1', 'First link points to the correct URL');
  assert.equal(this.$('a')[1].href, '/2', 'Second link points to the correct URL');
});
