import Ember from 'ember';

/**
 * Component that display complete treeview for resources including header
 *
 * On top of the standard functionality, it also support displaying count of
 * resource with error state.
 * If onCheckAction is defined then checkbox is displayed on front of every record.
 *
 * @todo: rename to better name as this component is not header anymore
 */
export default Ember.Component.extend({
  title: undefined,
  isCollapsed: true,
  onlyErrors: false,
  onCheckAction: undefined,

  errorCount: function countErrors() {
    const list = this.get('errorList');

    if (list) {
      return list.get('length');
    }
    return null;
  }.property('errorList.@each.status'),

  errorList: function createErrorList() {
    const list = this.get('data');
    if (list) {
      return list.filter(item => ['error', 'failed'].includes(item.get('status')));
    }
    return [];
  }.property('data.@each.status'),

  actions: {
    onSelectCollapse() {
      if (this.get('onlyErrors')) {
        this.set('isCollapsed', false);
        this.set('onlyErrors', false);
      } else {
        this.toggleProperty('isCollapsed');
      }
    },
    showOnlyErrors() {
      this.set('isCollapsed', false);
      this.set('onlyErrors', true);
    },
  },
});
