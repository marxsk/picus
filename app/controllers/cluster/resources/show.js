import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['filterString'],
  filterString: '',
});
