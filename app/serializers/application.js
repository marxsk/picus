import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  serialize(snapshot, options) {
    const record = snapshot.record;

    if (options.action === "delete") {
      // @todo: IDs should not be generated as there might be additional suffixes
      if (snapshot.modelName === "location-preference") {
        return `constraint_id=location-${record.get('resource.name')}-${record.get('node')}-${record.get('score')}`;
      } else if (snapshot.modelName === 'colocation-preference') {
        return `constraint_id=colocation-${record.get('resource.name')}-${record.get('targetResource')}-${record.get('score')}`;
      } else if (snapshot.modelName === 'ordering-preference') {
        return `constraint_id=ordering-${record.get('resource.name')}-${record.get('targetResource')}-${record.get('score')}`;
      } else if (snapshot.modelName === 'ticket-preference') {
        return `constraint_id=ticket-${record.get('ticket')}-${record.get('resource.name')}-${record.get('role')}`;
      }
    }
  }
});
