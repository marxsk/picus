import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  serialize(snapshot, options) {
    const record = snapshot.record;

    if (options.action === "delete") {
      if (snapshot.modelName === "location-preference") {
        return `constraint_id=location-${record.get('resource.name')}-${record.get('node')}-${record.get('score')}`;
      }
    }
  }
});
