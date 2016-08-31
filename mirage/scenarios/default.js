export default function(server) {
//  let resource = server.create('resource', {id: 222});
/*  let cluster = server.create('cluster');//, {resources: [resource]});
  cluster.createNode();
  let res = cluster.createResource();
  res.update('name', 'moje moe');
  cluster.save();
*/
  let cluster = server.create('cluster', {name: 'Second one'});
  const node = cluster.createNode({id: 222, name: 'Virtual machine', isCorosyncRunning: true, isCorosyncEnabled: true});
  node.createNodeAttribute({key: 'attr #1', value: 'foo'});
  node.createNodeAttribute({key: 'attr #2', value: 'bar'});
  node.createNodeUtilizationAttribute({key: 'util attr #99', value: 'bar bar'});

  let resource = cluster.createResource({id: 333, name: 'Apache Mock Server'});
  resource.createResource({id: 444, name: 'Child Mock'});
  resource.createResource({id: 445, name: 'Child Mock #2'});
}
