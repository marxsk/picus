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

  let resource = cluster.createResource({id: 333, name: 'Apache-Mock-Server', resourceType: 'group'});
  resource.createResource({id: 444, name: 'Child-Mock', agentType: 'xyz', resourceType: 'primitive'});
  resource.createResource({id: 445, name: 'Child-Mock-2', resourceType: 'primitive'});

  cluster.createResource({id: 446, name: 'MyMock-01', agentType: 'zzz', resourceType: 'primitive'});
  cluster.createResource({id: 447, name: 'MyMock-02', resourceType: 'primitive'});

  cluster.createProperty({
    "name":"election-timeout","default":"2min","readable_name":"election timeout:","source":"crmd","shortdesc":"*** Advanced Use Only ***.","type":"time","longdesc":"If need to adjust this value, it probably indicates the presence of a bug.","advanced":false,"value":'2m',
  });
  cluster.createProperty({
    "readable_name":"placement strategy","name":"placement_strategy","default":"balanced","enum":"default utilization minimal balanced","source":"pengine","shortdesc":"The strategy to determine resource placement","type":"enum","longdesc":"","advanced":true,"value":null
  });
  cluster.createProperty({
    "name":"maintenance-mode","default":"false","readable_name":"maintenance mode","source":"pengine","shortdesc":"Should the cluster monitor resources and start/stop them as required","type":"boolean","longdesc":"","advanced":true,"value":null
  });

  cluster.createFence({name: 'Fence-01', agentType: 'fence_apc'});
  cluster.createResource({name: 'resource-ping', resourceType: 'primitive', agentType: 'check_fping', resourceProvider: 'nagios'});

  cluster.createAclRole({
    name: 'Foo',
    description: 'Bar',
  })
  const role = cluster.createAclRole({
    name: 'Hugo',
    description: 'Hugo Hugo',
  });
  role.createUser({
    name: 'Bubu',
  });
}
