import Ember from 'ember';

/**
 * Component that creates a navigation bar for bs-tab
 *
 * Custom navigation for bs-tab is required as we want to reflect selected
 * tab in the URL (via controller).
 *
 */
export default Ember.Component.extend({
  /**
   * tab is bs-tab component for which navigation is created
   *
   * @public
   */
  tab: undefined,
  /**
   * Array of {name, title} that contains navigation information
   *
   * @public
   */
  items: undefined,
  onSetActiveTab: undefined,
});
