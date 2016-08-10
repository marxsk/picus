export default function() {
  this.timing = 400;      // delay for each request, automatically set to 0 during testing

  this.get('/managec/my/cluster_status', (schema) => {
    return schema.clusters.all();
  });
}
