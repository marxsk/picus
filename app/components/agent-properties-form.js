import Ember from 'ember';

/**
 * Component that generates part of form for always editable properties in resource/fence agents.
 *
 * This component should be encapsulated in the ember-form-for (via 'form' property)
 * in order to have full coverage of agent properties and settings.
 */
export default Ember.Component.extend({
  /**
   * form is ember-form-for component to which we include generated form-fields
   */
  form: undefined,
  /**
   * XML metadata of resource/fence agent
   *
   * @public
   */
  metadata: undefined,
});
