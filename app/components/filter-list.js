import Ember from 'ember';

export default Ember.Component.extend({
  /**
   * Data contains array of records that will be shown
   *
   * @property data
   * @type {DS.Array}
   * @public
   **/
  data: undefined,

  /**
   * Attribute of record that will be shown to user
   *
   * @property titleKey
   * @type {DS.String}
   * @public
   **/
  titleKey: 'title',

  /**
   * Attribute of record that will be used for record identification (links)
   *
   * @property idKey
   * @type {DS.String}
   * @public
   **/
  idKey: undefined,

  /**
   * Show component for filtering
   *
   * @property showFilter
   * @type {DS.Boolean}
   * @public
   **/
  showFilter: false,

  /**
   * Placeholder for filter component
   *
   * @property filterPlaceholder
   * @type {DS.String}
   * @public
   **/
  filterPlaceholder: 'Filtering by ...',

  /**
   * Current value of filter component
   *
   * @property filterString
   * @type {DS.String}
   * @private
   **/
  filterString: '',

  actions: {
     nothing() { return; }
   }
});
