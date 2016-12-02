export default function() {
  this.timing = 400;      // delay for each request, automatically set to 0 during testing

  this.get('/managec/my/cluster_status', (schema) => {
    return schema.clusters.all();
  });

  this.get('/remote/get_avail_fence_agents', () => {
    return ['fence_apc', 'fence_brocade', 'fence_ipmilan'];
  });

  this.del('/attributes/:id');

  this.post('/attributes');
  this.post('/nodes', (schema, request) => {
    var params = JSON.parse(request.requestBody);
    // @note: we have just one cluster with this ID
    params.clusterId = 1;

    return schema.nodes.create(params);
  });

  this.patch('/properties', function(schema, request) {
    const attrs = JSON.parse(request.requestBody);
    Object.keys(attrs.data.attributes).forEach((i) => {
        schema.db.properties.update({name: i}, {value: attrs.data.attributes[i]});
    });
  });
}
