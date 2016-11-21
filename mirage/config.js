export default function() {
  this.timing = 400;      // delay for each request, automatically set to 0 during testing

  this.get('/managec/my/cluster_status', (schema) => {
    return schema.clusters.all();
  });

  this.del('/attributes/:id');

  this.post('/attributes');

  this.patch('/properties', function(schema, request) {
    const attrs = JSON.parse(request.requestBody);
    Object.keys(attrs.data.attributes).forEach((i) => {
        schema.db.properties.update({name: i}, {value: attrs.data.attributes[i]});
    });
  });
}
