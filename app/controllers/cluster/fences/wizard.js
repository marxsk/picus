import Ember from 'ember';
import BaseController from 'picus/controllers/base-controller';

export default BaseController.extend({
  fenceMappingInfo: Ember.A(),
  _fenceMappingInfo: Ember.computed('fenceMappingInfo', function () {
    // add empty field so user can select that plug is not used in the cluster
    return Ember.A(this.get('fenceMappingInfo')).insertAt(0, ' ');
  }),
});
