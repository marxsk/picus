import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  _postTextSerializer(params) {
    return Object.keys(params).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }).join('&');
  },

  serialize(snapshot, options) {
    const record = snapshot.record;

    if (options.action === "delete") {
      // @todo: IDs for preferences should not be generated as there might be additional suffixes
      if (snapshot.modelName === "location-preference") {
        return `constraint_id=location-${record.get('resource.name')}-${record.get('node')}-${record.get('score')}`;
      } else if (snapshot.modelName === 'colocation-preference') {
        return `constraint_id=colocation-${record.get('resource.name')}-${record.get('targetResource')}-${record.get('score')}`;
      } else if (snapshot.modelName === 'ordering-preference') {
        return `constraint_id=ordering-${record.get('resource.name')}-${record.get('targetResource')}-${record.get('score')}-${record.get('action')}`;
      } else if (snapshot.modelName === 'ticket-preference') {
        return `constraint_id=ticket-${record.get('ticket')}-${record.get('resource.name')}-${record.get('role')}`;
      } else if (snapshot.modelName === 'attribute') {
        return this._postTextSerializer({
          res_id: record.get('resource.name'),
          key: record.get('key'),
          value: '',
        });
      } else if (snapshot.modelName === 'utilization-attribute') {
        return this._postTextSerializer({
          resource_id: record.get('resource.name'),
          name: record.get('name'),
          value: '',
        });
      } else {
        console.error(`[serializer] model ${snapshot.modelName} for DELETE can not be serialized`);
      }
    } else if (options.action === 'create') {
      let force = false;
      if (snapshot && snapshot.adapterOptions && snapshot.adapterOptions.force) {
        force = snapshot.adapterOptions.force;
      }

      if (snapshot.modelName === 'location-preference') {
        return this._postTextSerializer({
          res_id: record.get('resource.name'),
          disable_autocorrect: 1,
          c_type: 'loc',
          score: record.get('score'),
          rule: record.get('node'),
          node_id: record.get('node'),
          force: force,
        });
      } else if (snapshot.modelName === 'colocation-preference') {
        return this._postTextSerializer({
          res_id: record.get('resource.name'),
          disable_autocorrect: 1,
          c_type: 'col',
          score: record.get('score'),
          target_res_id: record.get('targetResource'),
          colocation_type: record.get('colocationType'),
          force: force,
        });
      } else if (snapshot.modelName === 'ordering-preference') {
        return this._postTextSerializer({
            res_id: record.get('resource.name'),
            disable_autocorrect: 1,
            c_type: 'ord',
            res_action: record.get('action'),
            score: record.get('score'),
            order: record.get('order'),
            target_action: record.get('targetAction'),
            target_res_id: record.get('targetResource'),
            force: force,
        });
      } else if (snapshot.modelName === 'ticket-preference') {
          return this._postTextSerializer({
            res_id: record.get('resource.name'),
            disable_autocorrect: 1,
            c_type: 'ticket',
            ticket: record.get('ticket'),
            role: record.get('role'),
            'loss-policy': record.get('lossPolicy'),
            force: force,
          });
      } else if (snapshot.modelName === 'attribute') {
        return this._postTextSerializer({
          res_id: record.get('resource.name'),
          key: record.get('key'),
          value: record.get('value'),
          force: force,
        });
      } else if (snapshot.modelName === 'utilization-attribute') {
        return this._postTextSerializer({
          resource_id: record.get('resource.name'),
          name: record.get('name'),
          value: record.get('value'),
          force: force,
        });
      } else if (snapshot.modelName === 'constraint-set') {
        const json = {
          disable_autocorrect: true,
          c_type: 'ord',
        };

        let encodedDynamic = [];
        record.get('resourceSets').forEach((s, i) => {
          const fieldName = `resources[${i}][]`;

          s.get('resources').forEach((resource) => {
            encodedDynamic.push(this._postTextSerializer({
              [fieldName]: resource.get('name')}
            ));
          })
        })

        return (this._postTextSerializer(json) + '&' + encodedDynamic.join('&'));
      } else {
        console.error(`[serializer] model ${snapshot.modelName} for CREATE can not be serialized`);
      }
    }
  }
});
