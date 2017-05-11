import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('agent-properties-sections', 'Integration | Component | agent properties sections', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{agent-properties-sections}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#agent-properties-sections}}
      template block text
    {{/agent-properties-sections}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
