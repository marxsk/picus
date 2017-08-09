import Ember from 'ember';

/**
 * Component for single line in the treeview.
 *
 * This component also handles hiding children elements.
 */
export default Ember.Component.extend({
  title: undefined,
  /**
   * (???) Very likely defined to handle filtering based on the status of resource 
   *
   * @property
   */
  status: undefined,
  component: undefined,
  componentId: undefined,
  isCollapsable: false,
  onCheckAction: undefined,

  isCollapsed: true,
  isChecked: false,

  toggleCheck: function(value) {
    this.set('isChecked', value);
    this.attrs.onCheckAction(this.get('component'), this.get('componentId'), this.get('isChecked'));
  },
});
