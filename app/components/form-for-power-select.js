import Ember from 'ember';

/**
 * Component that integrates ember-power-select(-multiple) into ember-form-for
 *
 * @todo: Reusing parameter 'step' for different purpose because I have
 *  not find a better way yet
 */
export default Ember.Component.extend({
  /**
   * Selected value in the combo-box that is mutated after change
   *
   * @property First positional parameter
   * @public
   */
  positionalParams: ['selected'],

  /**
   * Function that takes care about propagating changes to the ember-form-for
   *
   * @property update
   * @public
   */
  update: undefined,

  /**
   * Allow selecting multiple options in the field
   *
   * @property multiple
   * @public
   */
  multiple: false,

  actions: {
    onChange: function(selectedIndex, value) {
      console.log(this.get('propertyName'));
      this.get('pattern')(value);
      this.get('min').set('_' + this.get('propertyName'), value);
    },
    onCreate: function(newItem, component) {
      component.options.unshiftObject(newItem);
      component.selected.pushObject(newItem);
    },
  }
});
