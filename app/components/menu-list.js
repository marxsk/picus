import Ember from 'ember';

/**
 * Component that generates treeview based for resource agents
 *
 * This component displays all records from an array (via 'data') and recursively
 * pass all 'resources' attributes.
 */
export default Ember.Component.extend({
  data: undefined,
  onCheckAction: undefined,
});
