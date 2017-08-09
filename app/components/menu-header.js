import Ember from 'ember';

/**
 * Component that display complete treeview for resources including header
 *
 * On top of the standard functionality, it also support displaying count of
 * resource with error state.
 *
 * @todo: rename to better name as this component is not header anymore
 */
export default Ember.Component.extend({
  title: undefined,
  isCollapsed: true,
  onlyErrors: false,
  onCheckAction: undefined,

  errorCount: function() {
    const list = this.get('errorList');

    if (list) {
      return list.get('length');
    } else {
      return null;
    }
  }.property('errorList.@each.status'),

  errorList: function() {
    const list = this.get('data');
    if (list) {
      return list.filter(function(item) {
        return ['error', 'failed'].includes(item.get('status'));
      });
    } else {
      return [];
    }
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
    }
  },
});
