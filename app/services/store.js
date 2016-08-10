import DS from 'ember-data';

export default DS.Store.extend({
  /** Reload all data from backend

  Traditionally, Store works on more standard API so we can ask for specific
  types with findAll(type) methods. In case of pcsd, we have just one single
  endpoint that returns complete store after one request. Method that reloads
  data belongs to Adapter class but we want to access it also from the standard
  code.

  **/
  reloadData: function() {
    const res = this.retrieveManagedInstance('adapter', 'application').reloadData();
    const store = this;

    res.then(function(response) {
      store.push(response);
    }, function(error) {
      alert(error);
    });
    return;
  }
});
