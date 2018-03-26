import Response from 'ember-cli-mirage/response';

let counterID = 1;

function _getRecordByKey(params, attributeIds, schema, keyName) {
  let keyAlreadyExists = false;
  let attribute;

  if (!attributeIds) {
    return false;
  }

  attributeIds.some((attributeId) => {
    attribute = schema.find(attributeId);
    keyAlreadyExists = attribute && attribute.attrs[keyName] === params[keyName];
    return keyAlreadyExists;
  });

  if (!keyAlreadyExists) {
    attribute = undefined;
  }

  return attribute;
}

// CUD = Create Update Delete for all resource attributes
function _cudAttribute(resource, params, attributeIds, schema, keyName, createAttributeFn) {
  const valueName = 'value';
  const attribute = _getRecordByKey(params, attributeIds, schema, keyName);

  if (attribute && (params[valueName] === undefined || params[valueName] === '')) {
    return attribute.destroy();
  } else if (attribute) {
    return attribute.update(valueName, params[valueName]);
  }
  return createAttributeFn({
    [keyName]: params[keyName],
    [valueName]: params[valueName],
  });
}

// remove resource but do not destroy children resources
function _releaseResource(schema, attrs) {
  const cluster = schema.clusters.find(1);

  // move children resources to root
  const resource = schema.resources.where({ name: attrs.resource_id }).models[0];
  const appendResources = [];
  resource.resources.models.forEach((i) => {
    appendResources.push(i);
  });

  cluster.resources = cluster.resources.models.concat(appendResources);
  schema.db.resources.remove({ name: attrs.resource_id });
}

// create an "envelope" resource that contains original resource e.g. when cloning resource
function _createEnvelopeResource(schema, attrs, resourceNames, resourceAttributes) {
  const cluster = schema.clusters.find(1);
  const envelopeResource = cluster.createResource(resourceAttributes);

  const resIDs = [];
  resourceNames.forEach((x) => {
    if (x === '') {
      return;
    }

    const child = schema.resources.where({ name: x }).models[0];
    resIDs.push(child);

    // remove resource from parent-cluster; it will be available only via parent-resource
    const ress = [];
    cluster.resources.models.forEach((y) => {
      if (y.attrs.id !== child.id) {
        ress.push(y);
      }
    });
    cluster.resources = ress;
    cluster.save();
  });
  envelopeResource.resources = resIDs;
  envelopeResource.save();
  return envelopeResource;
}
export default function () {
  this.timing = 2000; // delay for each request, automatically set to 0 during testing
  this.clusterName = 'my';
  this.authenticated = false;

  this.get(
    '/clusters_overview',
    () =>
      '{"not_current_data":false,"cluster_list":[{"cluster_name":"my","error_list":[],"warning_list":[],"quorate":false,"status":"error","node_list":[{"name":"beta","status":"unknown","warning_list":[],"error_list":[]},{"id":"1","error_list":[],"warning_list":[],"status":"online","quorum":false,"uptime":"0 days, 00:02:38","name":"alpha","services":{"pacemaker":{"installed":true,"running":true,"enabled":true},"corosync":{"installed":true,"running":true,"enabled":true},"pcsd":{"installed":true,"running":true,"enabled":true},"cman":{"installed":false,"running":false,"enabled":false},"sbd":{"installed":false,"running":false,"enabled":false}},"corosync":true,"pacemaker":true,"cman":false,"corosync_enabled":true,"pacemaker_enabled":true,"pcsd_enabled":true,"sbd_config":null,"status_version":"2"}],"resource_list":[{"id":"jlkjlk","error_list":[],"warning_list":[],"class_type":"primitive","status":"blocked","meta_attr":[],"parent_id":null,"disabled":false,"agentname":"stonith:fence_apc_snmp","provider":null,"type":"fence_apc_snmp","stonith":true,"utilization":[],"instance_attr":[{"id":"jlkjlk-instance_attributes-ipaddr","name":"ipaddr","value":"1.2.3.4"},{"id":"jlkjlk-instance_attributes-port","name":"port","value":"6688"},{"id":"jlkjlk-instance_attributes-action","name":"action","value":"abc"}],"class":"stonith","crm_status":[{"id":"jlkjlk","resource_agent":"stonith:fence_apc_snmp","managed":true,"failed":false,"role":"Stopped","active":false,"orphaned":false,"failure_ignored":false,"nodes_running_on":0,"pending":null,"node":null}],"operations":[{"call_id":20,"crm_debug_origin":"do_update_resource","crm_feature_set":"3.0.10","exec_time":0,"exit_reason":null,"id":"jlkjlk_last_0","interval":0,"last_rc_change":1498137755,"last_run":1498137755,"on_node":"alpha","op_digest":"2837552e76fda553add1c2dea028897d","operation_key":"jlkjlk_monitor_0","operation":"monitor","op_force_restart":null,"op_restart_digest":null,"op_status":0,"queue_time":0,"rc_code":7,"transition_key":"5:0:7:81e00128-f587-4846-991e-a49164a8573a","transition_magic":"0:7;5:0:7:81e00128-f587-4846-991e-a49164a8573a"}]},{"id":"abc","error_list":[],"warning_list":[],"class_type":"primitive","status":"blocked","meta_attr":[],"parent_id":null,"disabled":false,"agentname":"stonith:fence_apc","provider":null,"type":"fence_apc","stonith":true,"utilization":[],"instance_attr":[{"id":"abc-instance_attributes-ipaddr","name":"ipaddr","value":"2.2.2.2"},{"id":"abc-instance_attributes-login","name":"login","value":"hugo"},{"id":"abc-instance_attributes-port","name":"port","value":"hugo"}],"class":"stonith","crm_status":[{"id":"abc","resource_agent":"stonith:fence_apc","managed":true,"failed":false,"role":"Stopped","active":false,"orphaned":false,"failure_ignored":false,"nodes_running_on":0,"pending":null,"node":null}],"operations":[{"call_id":24,"crm_debug_origin":"do_update_resource","crm_feature_set":"3.0.10","exec_time":0,"exit_reason":null,"id":"abc_last_0","interval":0,"last_rc_change":1498137756,"last_run":1498137756,"on_node":"alpha","op_digest":"eef4686df8169708b1edb8d55347fc44","operation_key":"abc_monitor_0","operation":"monitor","op_force_restart":null,"op_restart_digest":null,"op_status":0,"queue_time":0,"rc_code":7,"transition_key":"6:0:7:81e00128-f587-4846-991e-a49164a8573a","transition_magic":"0:7;6:0:7:81e00128-f587-4846-991e-a49164a8573a"}]},{"id":"vvvv","error_list":[],"warning_list":[],"class_type":"primitive","status":"blocked","meta_attr":[],"parent_id":null,"disabled":false,"agentname":"stonith:fence_apc","provider":null,"type":"fence_apc","stonith":true,"utilization":[],"instance_attr":[{"id":"vvvv-instance_attributes-ipaddr","name":"ipaddr","value":"123"},{"id":"vvvv-instance_attributes-login","name":"login","value":"12"},{"id":"vvvv-instance_attributes-port","name":"port","value":"1"}],"class":"stonith","crm_status":[{"id":"vvvv","resource_agent":"stonith:fence_apc","managed":true,"failed":false,"role":"Stopped","active":false,"orphaned":false,"failure_ignored":false,"nodes_running_on":0,"pending":null,"node":null}],"operations":[{"call_id":28,"crm_debug_origin":"do_update_resource","crm_feature_set":"3.0.10","exec_time":0,"exit_reason":null,"id":"vvvv_last_0","interval":0,"last_rc_change":1498137757,"last_run":1498137757,"on_node":"alpha","op_digest":"25b1a857d025d4871208d3db324da752","operation_key":"vvvv_monitor_0","operation":"monitor","op_force_restart":null,"op_restart_digest":null,"op_status":0,"queue_time":0,"rc_code":7,"transition_key":"7:0:7:81e00128-f587-4846-991e-a49164a8573a","transition_magic":"0:7;7:0:7:81e00128-f587-4846-991e-a49164a8573a"}]},{"id":"druha_ip","error_list":[],"warning_list":[],"class_type":"primitive","status":"blocked","meta_attr":[],"parent_id":null,"disabled":false,"agentname":"ocf::heartbeat:IPaddr2","provider":"heartbeat","type":"IPaddr2","stonith":false,"utilization":[],"instance_attr":[{"id":"druha_ip-instance_attributes-ip","name":"ip","value":"192.168.56.111"}],"class":"ocf","crm_status":[{"id":"druha_ip","resource_agent":"ocf::heartbeat:IPaddr2","managed":true,"failed":false,"role":"Stopped","active":false,"orphaned":false,"failure_ignored":false,"nodes_running_on":0,"pending":null,"node":null}],"operations":[{"call_id":37,"crm_debug_origin":"do_update_resource","crm_feature_set":"3.0.10","exec_time":38,"exit_reason":null,"id":"druha_ip_last_0","interval":0,"last_rc_change":1498137757,"last_run":1498137757,"on_node":"alpha","op_digest":"0031c40fc8cc966df94193573b7e2ed5","operation_key":"druha_ip_monitor_0","operation":"monitor","op_force_restart":null,"op_restart_digest":null,"op_status":0,"queue_time":0,"rc_code":7,"transition_key":"9:0:7:81e00128-f587-4846-991e-a49164a8573a","transition_magic":"0:7;9:0:7:81e00128-f587-4846-991e-a49164a8573a"}]},{"id":"druhy_indian","error_list":[],"warning_list":[],"class_type":"primitive","status":"blocked","meta_attr":[],"parent_id":null,"disabled":false,"agentname":"ocf::heartbeat:apache","provider":"heartbeat","type":"apache","stonith":false,"utilization":[],"instance_attr":[],"class":"ocf","crm_status":[{"id":"druhy_indian","resource_agent":"ocf::heartbeat:apache","managed":true,"failed":false,"role":"Stopped","active":false,"orphaned":false,"failure_ignored":false,"nodes_running_on":0,"pending":null,"node":null}],"operations":[{"call_id":41,"crm_debug_origin":"do_update_resource","crm_feature_set":"3.0.10","exec_time":27,"exit_reason":null,"id":"druhy_indian_last_0","interval":0,"last_rc_change":1498137757,"last_run":1498137757,"on_node":"alpha","op_digest":"f2317cad3d54cec5d7d7aa7d0bf35cf8","operation_key":"druhy_indian_monitor_0","operation":"monitor","op_force_restart":null,"op_restart_digest":null,"op_status":0,"queue_time":0,"rc_code":7,"transition_key":"10:0:7:81e00128-f587-4846-991e-a49164a8573a","transition_magic":"0:7;10:0:7:81e00128-f587-4846-991e-a49164a8573a"}]},{"id":"dumb2","error_list":[],"warning_list":[],"class_type":"primitive","status":"blocked","meta_attr":[],"parent_id":null,"disabled":false,"agentname":"ocf::heartbeat:Dummy","provider":"heartbeat","type":"Dummy","stonith":false,"utilization":[],"instance_attr":[],"class":"ocf","crm_status":[{"id":"dumb2","resource_agent":"ocf::heartbeat:Dummy","managed":true,"failed":false,"role":"Stopped","active":false,"orphaned":false,"failure_ignored":false,"nodes_running_on":0,"pending":null,"node":null}],"operations":[{"call_id":50,"crm_debug_origin":"do_update_resource","crm_feature_set":"3.0.10","exec_time":7,"exit_reason":null,"id":"dumb2_last_0","interval":0,"last_rc_change":1498137757,"last_run":1498137757,"on_node":"alpha","op_digest":"f2317cad3d54cec5d7d7aa7d0bf35cf8","operation_key":"dumb2_monitor_0","operation":"monitor","op_force_restart":" state ","op_restart_digest":"f2317cad3d54cec5d7d7aa7d0bf35cf8","op_status":0,"queue_time":0,"rc_code":7,"transition_key":"12:0:7:81e00128-f587-4846-991e-a49164a8573a","transition_magic":"0:7;12:0:7:81e00128-f587-4846-991e-a49164a8573a"}]},{"id":"foo","error_list":[],"warning_list":[],"class_type":"primitive","status":"blocked","meta_attr":[],"parent_id":null,"disabled":false,"agentname":"ocf::heartbeat:Dummy","provider":"heartbeat","type":"Dummy","stonith":false,"utilization":[],"instance_attr":[],"class":"ocf","crm_status":[{"id":"foo","resource_agent":"ocf::heartbeat:Dummy","managed":true,"failed":false,"role":"Stopped","active":false,"orphaned":false,"failure_ignored":false,"nodes_running_on":0,"pending":null,"node":null}],"operations":[{"call_id":54,"crm_debug_origin":"do_update_resource","crm_feature_set":"3.0.10","exec_time":19,"exit_reason":null,"id":"foo_last_0","interval":0,"last_rc_change":1498137757,"last_run":1498137757,"on_node":"alpha","op_digest":"f2317cad3d54cec5d7d7aa7d0bf35cf8","operation_key":"foo_monitor_0","operation":"monitor","op_force_restart":" state ","op_restart_digest":"f2317cad3d54cec5d7d7aa7d0bf35cf8","op_status":0,"queue_time":1,"rc_code":7,"transition_key":"13:0:7:81e00128-f587-4846-991e-a49164a8573a","transition_magic":"0:7;13:0:7:81e00128-f587-4846-991e-a49164a8573a"}]},{"id":"myrs","error_list":[],"warning_list":[],"class_type":"primitive","status":"blocked","meta_attr":[{"id":"myrs-meta_attributes-ggg","name":"ggg","value":"aaa"}],"parent_id":null,"disabled":false,"agentname":"ocf::heartbeat:IPaddr2","provider":"heartbeat","type":"IPaddr2","stonith":false,"utilization":[],"instance_attr":[{"id":"myrs-instance_attributes-ip","name":"ip","value":"192.168.56.202"},{"id":"myrs-instance_attributes-cidr_netmask","name":"cidr_netmask","value":"32"}],"class":"ocf","crm_status":[{"id":"myrs","resource_agent":"ocf::heartbeat:IPaddr2","managed":true,"failed":false,"role":"Stopped","active":false,"orphaned":false,"failure_ignored":false,"nodes_running_on":0,"pending":null,"node":null}],"operations":[{"call_id":58,"crm_debug_origin":"do_update_resource","crm_feature_set":"3.0.10","exec_time":87,"exit_reason":null,"id":"myrs_last_0","interval":0,"last_rc_change":1498137757,"last_run":1498137757,"on_node":"alpha","op_digest":"d368d1259fe5413c9e285bd513350209","operation_key":"myrs_monitor_0","operation":"monitor","op_force_restart":null,"op_restart_digest":null,"op_status":0,"queue_time":1,"rc_code":7,"transition_key":"14:0:7:81e00128-f587-4846-991e-a49164a8573a","transition_magic":"0:7;14:0:7:81e00128-f587-4846-991e-a49164a8573a"}]},{"id":"attacking_clones-clone","error_list":[],"warning_list":[],"class_type":"clone","status":"blocked","meta_attr":[],"parent_id":null,"disabled":false,"member":{"id":"attacking_clones","error_list":[],"warning_list":[],"class_type":"primitive","status":"blocked","meta_attr":[],"parent_id":"attacking_clones-clone","disabled":false,"agentname":"ocf::heartbeat:clvm","provider":"heartbeat","type":"clvm","stonith":false,"utilization":[],"instance_attr":[],"class":"ocf","crm_status":[{"id":"attacking_clones","resource_agent":"ocf::heartbeat:clvm","managed":true,"failed":false,"role":"Stopped","active":false,"orphaned":false,"failure_ignored":false,"nodes_running_on":0,"pending":null,"node":null},{"id":"attacking_clones","resource_agent":"ocf::heartbeat:clvm","managed":true,"failed":false,"role":"Stopped","active":false,"orphaned":false,"failure_ignored":false,"nodes_running_on":0,"pending":null,"node":null}],"operations":[{"call_id":6,"crm_debug_origin":"do_update_resource","crm_feature_set":"3.0.10","exec_time":54,"exit_reason":null,"id":"attacking_clones_last_0","interval":0,"last_rc_change":1498137755,"last_run":1498137755,"on_node":"alpha","op_digest":"f2317cad3d54cec5d7d7aa7d0bf35cf8","operation_key":"attacking_clones_monitor_0","operation":"monitor","op_force_restart":"","op_restart_digest":"f2317cad3d54cec5d7d7aa7d0bf35cf8","op_status":0,"queue_time":0,"rc_code":7,"transition_key":"2:0:7:81e00128-f587-4846-991e-a49164a8573a","transition_magic":"0:7;2:0:7:81e00128-f587-4846-991e-a49164a8573a"}]}},{"id":"comanche-clone","error_list":[],"warning_list":[],"class_type":"clone","status":"blocked","meta_attr":[],"parent_id":null,"disabled":false,"member":{"id":"comanche","error_list":[],"warning_list":[],"class_type":"group","status":"blocked","meta_attr":[],"parent_id":"comanche-clone","disabled":false,"members":[{"id":"prva_ip","error_list":[],"warning_list":[],"class_type":"primitive","status":"blocked","meta_attr":[],"parent_id":"comanche","disabled":false,"agentname":"ocf::heartbeat:IPaddr2","provider":"heartbeat","type":"IPaddr2","stonith":false,"utilization":[],"instance_attr":[{"id":"prva_ip-instance_attributes-ip","name":"ip","value":"192.168.56.200"}],"class":"ocf","crm_status":[{"id":"prva_ip","resource_agent":"ocf::heartbeat:IPaddr2","managed":true,"failed":false,"role":"Stopped","active":false,"orphaned":false,"failure_ignored":false,"nodes_running_on":0,"pending":null,"node":null},{"id":"prva_ip","resource_agent":"ocf::heartbeat:IPaddr2","managed":true,"failed":false,"role":"Stopped","active":false,"orphaned":false,"failure_ignored":false,"nodes_running_on":0,"pending":null,"node":null}],"operations":[{"call_id":11,"crm_debug_origin":"do_update_resource","crm_feature_set":"3.0.10","exec_time":54,"exit_reason":null,"id":"prva_ip_last_0","interval":0,"last_rc_change":1498137755,"last_run":1498137755,"on_node":"alpha","op_digest":"11135a7a9104f18beaa85dc6cb2f002f","operation_key":"prva_ip_monitor_0","operation":"monitor","op_force_restart":null,"op_restart_digest":null,"op_status":0,"queue_time":0,"rc_code":7,"transition_key":"3:0:7:81e00128-f587-4846-991e-a49164a8573a","transition_magic":"0:7;3:0:7:81e00128-f587-4846-991e-a49164a8573a"}]},{"id":"prvy_indian","error_list":[],"warning_list":[],"class_type":"primitive","status":"blocked","meta_attr":[],"parent_id":"comanche","disabled":false,"agentname":"ocf::heartbeat:apache","provider":"heartbeat","type":"apache","stonith":false,"utilization":[],"instance_attr":[],"class":"ocf","crm_status":[{"id":"prvy_indian","resource_agent":"ocf::heartbeat:apache","managed":true,"failed":false,"role":"Stopped","active":false,"orphaned":false,"failure_ignored":false,"nodes_running_on":0,"pending":null,"node":null},{"id":"prvy_indian","resource_agent":"ocf::heartbeat:apache","managed":true,"failed":false,"role":"Stopped","active":false,"orphaned":false,"failure_ignored":false,"nodes_running_on":0,"pending":null,"node":null}],"operations":[{"call_id":16,"crm_debug_origin":"do_update_resource","crm_feature_set":"3.0.10","exec_time":33,"exit_reason":null,"id":"prvy_indian_last_0","interval":0,"last_rc_change":1498137755,"last_run":1498137755,"on_node":"alpha","op_digest":"f2317cad3d54cec5d7d7aa7d0bf35cf8","operation_key":"prvy_indian_monitor_0","operation":"monitor","op_force_restart":null,"op_restart_digest":null,"op_status":0,"queue_time":0,"rc_code":7,"transition_key":"4:0:7:81e00128-f587-4846-991e-a49164a8573a","transition_magic":"0:7;4:0:7:81e00128-f587-4846-991e-a49164a8573a"}]}]}},{"id":"forest-clone","error_list":[],"warning_list":[],"class_type":"clone","status":"blocked","meta_attr":[],"parent_id":null,"disabled":false,"member":{"id":"forest","error_list":[],"warning_list":[],"class_type":"primitive","status":"blocked","meta_attr":[],"parent_id":"forest-clone","disabled":false,"agentname":"ocf::heartbeat:Dummy","provider":"heartbeat","type":"Dummy","stonith":false,"utilization":[],"instance_attr":[],"class":"ocf","crm_status":[{"id":"forest","resource_agent":"ocf::heartbeat:Dummy","managed":true,"failed":false,"role":"Stopped","active":false,"orphaned":false,"failure_ignored":false,"nodes_running_on":0,"pending":null,"node":null},{"id":"forest","resource_agent":"ocf::heartbeat:Dummy","managed":true,"failed":false,"role":"Stopped","active":false,"orphaned":false,"failure_ignored":false,"nodes_running_on":0,"pending":null,"node":null}],"operations":[{"call_id":33,"crm_debug_origin":"do_update_resource","crm_feature_set":"3.0.10","exec_time":10,"exit_reason":null,"id":"forest_last_0","interval":0,"last_rc_change":1498137757,"last_run":1498137757,"on_node":"alpha","op_digest":"f2317cad3d54cec5d7d7aa7d0bf35cf8","operation_key":"forest_monitor_0","operation":"monitor","op_force_restart":" state ","op_restart_digest":"f2317cad3d54cec5d7d7aa7d0bf35cf8","op_status":0,"queue_time":0,"rc_code":7,"transition_key":"8:0:7:81e00128-f587-4846-991e-a49164a8573a","transition_magic":"0:7;8:0:7:81e00128-f587-4846-991e-a49164a8573a"}]}},{"id":"dumb1-master","error_list":[],"warning_list":[{"message":"Resource is master/slave but has not been promoted to master on any node.","type":"no_master"}],"class_type":"master","status":"blocked","meta_attr":[],"parent_id":null,"disabled":false,"member":{"id":"dumb1","error_list":[],"warning_list":[],"class_type":"primitive","status":"blocked","meta_attr":[],"parent_id":"dumb1-master","disabled":false,"agentname":"ocf::heartbeat:Dummy","provider":"heartbeat","type":"Dummy","stonith":false,"utilization":[],"instance_attr":[],"class":"ocf","crm_status":[{"id":"dumb1","resource_agent":"ocf::heartbeat:Dummy","managed":true,"failed":false,"role":"Stopped","active":false,"orphaned":false,"failure_ignored":false,"nodes_running_on":0,"pending":null,"node":null},{"id":"dumb1","resource_agent":"ocf::heartbeat:Dummy","managed":true,"failed":false,"role":"Stopped","active":false,"orphaned":false,"failure_ignored":false,"nodes_running_on":0,"pending":null,"node":null}],"operations":[{"call_id":46,"crm_debug_origin":"do_update_resource","crm_feature_set":"3.0.10","exec_time":6,"exit_reason":null,"id":"dumb1_last_0","interval":0,"last_rc_change":1498137757,"last_run":1498137757,"on_node":"alpha","op_digest":"f2317cad3d54cec5d7d7aa7d0bf35cf8","operation_key":"dumb1_monitor_0","operation":"monitor","op_force_restart":" state ","op_restart_digest":"f2317cad3d54cec5d7d7aa7d0bf35cf8","op_status":0,"queue_time":1,"rc_code":7,"transition_key":"11:0:7:81e00128-f587-4846-991e-a49164a8573a","transition_magic":"0:7;11:0:7:81e00128-f587-4846-991e-a49164a8573a"}]}}],"available_features":["sbd","ticket_constraints"],"groups":["comanche"],"constraints":{"rsc_colocation":[{"id":"pcs_rsc_colocation_set_prvy_indian","score":"INFINITY","sets":[{"id":"pcs_rsc_set_prvy_indian","resources":["prvy_indian"]}]},{"id":"colocation-attacking_clones-clone-comanche-clone-44","rsc":"attacking_clones-clone","score":"44","with-rsc":"comanche-clone"}]},"cluster_settings":{"have-watchdog":"false","dc-version":"1.1.15-1.fc23-e174ec8","cluster-infrastructure":"corosync","cluster-name":"my","pe-warn-series-max":"3000","pe-input-series-max":"2000","batch-limit":"111"},"need_ring1_address":false,"is_cman_with_udpu_transport":false,"acls":{"role":{},"group":{},"user":{},"target":{}},"username":"hacluster","fence_levels":{},"node_attr":{"beta":[{"id":"nodes-2-ggg","name":"ggg","value":"gg"},{"id":"nodes-2-hugohugo","name":"hugohugo","value":"111"}]},"nodes_utilization":{},"known_nodes":["alpha","beta"],"corosync_online":["alpha"],"corosync_offline":["beta"],"pacemaker_online":["alpha"],"pacemaker_offline":["beta"],"pacemaker_standby":[],"status_version":"2"}]}',
  );

  this.get('/managec/my/cluster_status', schema => schema.clusters.all());

  this.get(
    '/remote/get_avail_fence_agents',
    () => '{"fence_apc":{"type":"fence_apc"},"fence_ipmilan":{"type":"fence_ipmilan"}}',
  );

  this.get('/remote/get_avail_resource_agents', () => ({
    'ocf:heartbeat:docker': { type: 'docker' },
    'nagios:check_fping': { type: 'check_fping' },
  }));

  this.get(`/managec/${this.clusterName}/get_fence_agent_metadata`, (schema, request) => {
    switch (request.queryParams.agent) {
      case 'stonith:fence_apc':
        return '{"shortdesc": "Fence agent for APC over telnet/ssh", "longdesc": "fence_apc is an I/O Fencing agent which can be used with the APC network power switch. It logs into device via telnet/ssh  and reboots a specified outlet. Lengthy telnet/ssh connections should be avoided while a GFS cluster  is  running  because  the  connection will block any necessary fencing actions.", "parameters": [{"name": "action", "default": "reboot", "required": false, "shortdesc": "Fencing Action- WARNING: specifying \'action\' is deprecated and not necessary with current Pacemaker versions", "type": "string", "longdesc": ""}, {"name": "cmd_prompt", "default": "[\'n>\', \'napc>\']", "required": false, "shortdesc": "Force Python regex for command prompt", "type": "string", "longdesc": ""}, {"name": "identity_file", "default": null, "required": false, "shortdesc": "Identity file for ssh", "type": "string", "longdesc": ""}, {"name": "inet4_only", "default": "1", "required": false, "shortdesc": "Forces agent to use IPv4 addresses only", "type": "boolean", "longdesc": ""}, {"name": "inet6_only", "default": null, "required": false, "shortdesc": "Forces agent to use IPv6 addresses only", "type": "boolean", "longdesc": ""}, {"name": "ipaddr", "default": null, "required": false, "shortdesc": "IP Address or Hostname", "type": "string", "longdesc": ""}, {"name": "ipport", "default": "23", "required": false, "shortdesc": "TCP/UDP port to use for connection with device", "type": "string", "longdesc": ""}, {"name": "login", "default": null, "required": false, "shortdesc": "Login Name", "type": "string", "longdesc": ""}, {"name": "passwd", "level": "basic", "default": null, "required": false, "shortdesc": "Login password or passphrase", "type": "string", "longdesc": ""}, {"name": "passwd_script", "default": null, "required": false, "shortdesc": "Script to retrieve password", "type": "string", "longdesc": ""}, {"name": "port", "default": null, "required": true,  "level": "basic", "shortdesc": "Physical plug number, name of virtual machine or UUID", "type": "string", "longdesc": ""}, {"name": "secure", "level": "basic", "default": null, "required": false, "shortdesc": "SSH connection", "type": "boolean", "longdesc": ""}, {"name": "ssh_options", "default": "-1 -c blowfish", "required": false, "shortdesc": "SSH options to use", "type": "string", "longdesc": ""}, {"name": "switch", "default": null, "required": false, "shortdesc": "Physical switch number on device", "type": "string", "longdesc": ""}, {"name": "separator", "default": ",", "required": false, "shortdesc": "Separator for CSV created by operation list", "type": "string", "longdesc": ""}, {"name": "delay", "default": "0", "required": false, "shortdesc": "Wait X seconds before fencing is started", "type": "string", "longdesc": ""}, {"name": "login_timeout", "default": "5", "required": false, "shortdesc": "Wait X seconds for cmd prompt after login", "type": "string", "longdesc": ""}, {"name": "power_timeout", "default": "20", "required": false, "shortdesc": "Test X seconds for status change after ON/OFF", "type": "string", "longdesc": ""}, {"name": "power_wait", "default": "0", "required": false, "shortdesc": "Wait X seconds after issuing ON/OFF", "type": "string", "longdesc": ""}, {"name": "shell_timeout", "default": "3", "required": false, "shortdesc": "Wait X seconds for cmd prompt after issuing command", "type": "string", "longdesc": ""}, {"name": "retry_on", "default": "1", "required": false, "shortdesc": "Count of attempts to retry power on", "type": "string", "longdesc": ""}, {"name": "ssh_path", "default": "/usr/bin/ssh", "required": false, "shortdesc": "Path to ssh binary", "type": "string", "longdesc": ""}, {"name": "telnet_path", "default": "/usr/bin/telnet", "required": false, "shortdesc": "Path to telnet binary", "type": "string", "longdesc": ""}, {"name": "priority", "default": "0", "required": false, "shortdesc": "The priority of the stonith resource. Devices are tried in order of highest priority to lowest.", "type": "integer", "longdesc": "The priority of the stonith resource. Devices are tried in order of highest priority to lowest.", "advanced": false}, {"name": "pcmk_host_argument", "default": "port", "required": false, "shortdesc": "Advanced use only: An alternate parameter to supply instead of \'port\'", "type": "string", "longdesc": "Advanced use only: An alternate parameter to supply instead of \'port\'. Some devices do not support the standard \'port\' parameter or may provide additional ones. Use this to specify an alternate, device-specific, parameter that should indicate the machine to be fenced. A value of \'none\' can be used to tell the cluster not to supply any additional parameters.", "advanced": true}, {"name": "pcmk_host_map", "default": "", "required": false, "shortdesc": "A mapping of host names to ports numbers for devices that do not support host names.", "type": "string", "longdesc": "A mapping of host names to ports numbers for devices that do not support host names.-Eg. node1:1;node2:2,3 would tell the cluster to use port 1 for node1 and ports 2 and 3 for node2", "advanced": false}, {"name": "pcmk_host_list", "default": "", "required": false, "shortdesc": "A list of machines controlled by this device (Optional unless pcmk_host_check=static-list).", "type": "string", "longdesc": "A list of machines controlled by this device (Optional unless pcmk_host_check=static-list).", "advanced": false}, {"name": "pcmk_host_check", "default": "dynamic-list", "required": false, "shortdesc": "How to determine which machines are controlled by the device.", "type": "string", "longdesc": "How to determine which machines are controlled by the device.-Allowed values: dynamic-list (query the device), static-list (check the pcmk_host_list attribute), none (assume every device can fence every machine)", "advanced": false}, {"name": "pcmk_delay_max", "default": "0s", "required": false, "shortdesc": "Enable random delay for stonith actions and specify the maximum of random delay", "type": "time", "longdesc": "Enable random delay for stonith actions and specify the maximum of random delay-This prevents double fencing when using slow devices such as sbd.-Use this to enable random delay for stonith actions and specify the maximum of random delay.", "advanced": false}, {"name": "pcmk_action_limit", "default": "1", "required": false, "shortdesc": "The maximum number of actions can be performed in parallel on this device", "type": "integer", "longdesc": "The maximum number of actions can be performed in parallel on this device-Pengine property concurrent-fencing=true needs to be configured first.-Then use this to specify the maximum number of actions can be performed in parallel on this device. -1 is unlimited.", "advanced": false}, {"name": "pcmk_reboot_action", "default": "reboot", "required": false, "shortdesc": "Advanced use only: An alternate command to run instead of \'reboot\'", "type": "string", "longdesc": "Advanced use only: An alternate command to run instead of \'reboot\'-Some devices do not support the standard commands or may provide additional ones.-Use this to specify an alternate, device-specific, command that implements the \'reboot\' action.", "advanced": true}, {"name": "pcmk_reboot_timeout", "default": "60s", "required": false, "shortdesc": "Advanced use only: Specify an alternate timeout to use for reboot actions instead of stonith-timeout", "type": "time", "longdesc": "Advanced use only: Specify an alternate timeout to use for reboot actions instead of stonith-timeout-Some devices need much more/less time to complete than normal.-Use this to specify an alternate, device-specific, timeout for \'reboot\' actions.", "advanced": true}, {"name": "pcmk_reboot_retries", "default": "2", "required": false, "shortdesc": "Advanced use only: The maximum number of times to retry the \'reboot\' command within the timeout period", "type": "integer", "longdesc": "Advanced use only: The maximum number of times to retry the \'reboot\' command within the timeout period-Some devices do not support multiple connections. Operations may \'fail\' if the device is busy with another task so Pacemaker will automatically retry the operation, if there is time remaining. Use this option to alter the number of times Pacemaker retries \'reboot\' actions before giving up.", "advanced": true}, {"name": "pcmk_off_action", "default": "off", "required": false, "shortdesc": "Advanced use only: An alternate command to run instead of \'off\'", "type": "string", "longdesc": "Advanced use only: An alternate command to run instead of \'off\'-Some devices do not support the standard commands or may provide additional ones.-Use this to specify an alternate, device-specific, command that implements the \'off\' action.", "advanced": true}, {"name": "pcmk_off_timeout", "default": "60s", "required": false, "shortdesc": "Advanced use only: Specify an alternate timeout to use for off actions instead of stonith-timeout", "type": "time", "longdesc": "Advanced use only: Specify an alternate timeout to use for off actions instead of stonith-timeout-Some devices need much more/less time to complete than normal.-Use this to specify an alternate, device-specific, timeout for \'off\' actions.", "advanced": true}, {"name": "pcmk_off_retries", "default": "2", "required": false, "shortdesc": "Advanced use only: The maximum number of times to retry the \'off\' command within the timeout period", "type": "integer", "longdesc": "Advanced use only: The maximum number of times to retry the \'off\' command within the timeout period-Some devices do not support multiple connections. Operations may \'fail\' if the device is busy with another task so Pacemaker will automatically retry the operation, if there is time remaining. Use this option to alter the number of times Pacemaker retries \'off\' actions before giving up.", "advanced": true}, {"name": "pcmk_list_action", "default": "list", "required": false, "shortdesc": "Advanced use only: An alternate command to run instead of \'list\'", "type": "string", "longdesc": "Advanced use only: An alternate command to run instead of \'list\'-Some devices do not support the standard commands or may provide additional ones.-Use this to specify an alternate, device-specific, command that implements the \'list\' action.", "advanced": true}, {"name": "pcmk_list_timeout", "default": "60s", "required": false, "shortdesc": "Advanced use only: Specify an alternate timeout to use for list actions instead of stonith-timeout", "type": "time", "longdesc": "Advanced use only: Specify an alternate timeout to use for list actions instead of stonith-timeout-Some devices need much more/less time to complete than normal.-Use this to specify an alternate, device-specific, timeout for \'list\' actions.", "advanced": true}, {"name": "pcmk_list_retries", "default": "2", "required": false, "shortdesc": "Advanced use only: The maximum number of times to retry the \'list\' command within the timeout period", "type": "integer", "longdesc": "Advanced use only: The maximum number of times to retry the \'list\' command within the timeout period-Some devices do not support multiple connections. Operations may \'fail\' if the device is busy with another task so Pacemaker will automatically retry the operation, if there is time remaining. Use this option to alter the number of times Pacemaker retries \'list\' actions before giving up.", "advanced": true}, {"name": "pcmk_monitor_action", "default": "monitor", "required": false, "shortdesc": "Advanced use only: An alternate command to run instead of \'monitor\'", "type": "string", "longdesc": "Advanced use only: An alternate command to run instead of \'monitor\'-Some devices do not support the standard commands or may provide additional ones.-Use this to specify an alternate, device-specific, command that implements the \'monitor\' action.", "advanced": true}, {"name": "pcmk_monitor_timeout", "default": "60s", "required": false, "shortdesc": "Advanced use only: Specify an alternate timeout to use for monitor actions instead of stonith-timeout", "type": "time", "longdesc": "Advanced use only: Specify an alternate timeout to use for monitor actions instead of stonith-timeout-Some devices need much more/less time to complete than normal.-Use this to specify an alternate, device-specific, timeout for \'monitor\' actions.", "advanced": true}, {"name": "pcmk_monitor_retries", "default": "2", "required": false, "shortdesc": "Advanced use only: The maximum number of times to retry the \'monitor\' command within the timeout period", "type": "integer", "longdesc": "Advanced use only: The maximum number of times to retry the \'monitor\' command within the timeout period-Some devices do not support multiple connections. Operations may \'fail\' if the device is busy with another task so Pacemaker will automatically retry the operation, if there is time remaining. Use this option to alter the number of times Pacemaker retries \'monitor\' actions before giving up.", "advanced": true}, {"name": "pcmk_status_action", "default": "status", "required": false, "shortdesc": "Advanced use only: An alternate command to run instead of \'status\'", "type": "string", "longdesc": "Advanced use only: An alternate command to run instead of \'status\'-Some devices do not support the standard commands or may provide additional ones.-Use this to specify an alternate, device-specific, command that implements the \'status\' action.", "advanced": true}, {"name": "pcmk_status_timeout", "default": "60s", "required": false, "shortdesc": "Advanced use only: Specify an alternate timeout to use for status actions instead of stonith-timeout", "type": "time", "longdesc": "Advanced use only: Specify an alternate timeout to use for status actions instead of stonith-timeout-Some devices need much more/less time to complete than normal.-Use this to specify an alternate, device-specific, timeout for \'status\' actions.", "advanced": true}, {"name": "pcmk_status_retries", "default": "2", "required": false, "shortdesc": "Advanced use only: The maximum number of times to retry the \'status\' command within the timeout period", "type": "integer", "longdesc": "Advanced use only: The maximum number of times to retry the \'status\' command within the timeout period-Some devices do not support multiple connections. Operations may \'fail\' if the device is busy with another task so Pacemaker will automatically retry the operation, if there is time remaining. Use this option to alter the number of times Pacemaker retries \'status\' actions before giving up.", "advanced": true}], "name": "stonith:fence_apc"}';
      case 'stonith:fence_ipmilan':
        return '{"shortdesc": "Fence agent for IPMI", "longdesc": "fence_ipmilan is an I/O Fencing agentwhich can be used with machines controlled by IPMI.This agent calls support software ipmitool (http://ipmitool.sf.net/).", "parameters": [{"name": "action", "default": "reboot", "required": false, "shortdesc": "Fencing Action-WARNING: specifying \'action\' is deprecated and not necessary with current Pacemaker versions", "type": "string", "longdesc": ""}, {"name": "auth", "default": null, "required": false, "shortdesc": "IPMI Lan Auth type.", "type": "select", "longdesc": ""}, {"name": "cipher", "default": "0", "required": false, "shortdesc": "Ciphersuite to use (same as ipmitool -C parameter)", "type": "string", "longdesc": ""}, {"name": "inet4_only", "default": null, "required": false, "shortdesc": "Forces agent to use IPv4 addresses only", "type": "boolean", "longdesc": ""}, {"name": "inet6_only", "default": null, "required": false, "shortdesc": "Forces agent to use IPv6 addresses only", "type": "boolean", "longdesc": ""}, {"name": "ipaddr", "default": null, "required": true, "shortdesc": "IP Address or Hostname", "type": "string", "longdesc": ""}, {"name": "ipport", "default": "623", "required": false, "shortdesc": "TCP/UDP port to use for connection with device", "type": "string", "longdesc": ""}, {"name": "lanplus", "default": "0", "required": false, "shortdesc": "Use Lanplus to improve security of connection", "type": "boolean", "longdesc": ""}, {"name": "login", "default": null, "required": false, "shortdesc": "Login Name", "type": "string", "longdesc": ""}, {"name": "method", "default": "onoff", "required": false, "shortdesc": "Method to fence (onoff|cycle)", "type": "select", "longdesc": ""}, {"name": "passwd", "default": null, "required": false, "shortdesc": "Login password or passphrase", "type": "string", "longdesc": ""}, {"name": "passwd_script", "default": null, "required": false, "shortdesc": "Script to retrieve password", "type": "string", "longdesc": ""}, {"name": "privlvl", "default": "administrator", "required": false, "shortdesc": "Privilege level on IPMI device", "type": "select", "longdesc": ""}, {"name": "delay", "default": "0", "required": false, "shortdesc": "Wait X seconds before fencing is started", "type": "string", "longdesc": ""}, {"name": "ipmitool_path", "default": "/usr/bin/ipmitool", "required": false, "shortdesc": "Path to ipmitool binary", "type": "string", "longdesc": ""}, {"name": "login_timeout", "default": "5", "required": false, "shortdesc": "Wait X seconds for cmd prompt after login", "type": "string", "longdesc": ""}, {"name": "power_timeout", "default": "20", "required": false, "shortdesc": "Test X seconds for status change after ON/OFF", "type": "string", "longdesc": ""}, {"name": "power_wait", "default": "0", "required": false, "shortdesc": "Wait X seconds after issuing ON/OFF", "type": "string", "longdesc": ""}, {"name": "shell_timeout", "default": "3", "required": false, "shortdesc": "Wait X seconds for cmd prompt after issuing command", "type": "string", "longdesc": ""}, {"name": "retry_on", "default": "1", "required": false, "shortdesc": "Count of attempts to retry power on", "type": "string", "longdesc": ""}, {"name": "sudo", "default": null, "required": false, "shortdesc": "Use sudo (without password) when calling 3rd party sotfware.", "type": "boolean", "longdesc": ""}, {"name": "sudo_path", "default": "/usr/bin/sudo", "required": false, "shortdesc": "Path to sudo binary", "type": "string", "longdesc": ""}, {"name": "priority", "default": "0", "required": false, "shortdesc": "The priority of the stonith resource. Devices are tried in order of highest priority to lowest.", "type": "integer", "longdesc": "The priority of the stonith resource. Devices are tried in order of highest priority to lowest.", "advanced": false}, {"name": "pcmk_host_argument", "default": "port", "required": false, "shortdesc": "Advanced use only: An alternate parameter to supply instead of \'port\'", "type": "string", "longdesc": "Advanced use only: An alternate parameter to supply instead of \'port\'-Some devices do not support the standard \'port\' parameter or may provide additional ones.-Use this to specify an alternate, device-specific, parameter that should indicate the machine to be fenced.-A value of \'none\' can be used to tell the cluster not to supply any additional parameters.", "advanced": true}, {"name": "pcmk_host_map", "default": "", "required": false, "shortdesc": "A mapping of host names to ports numbers for devices that do not support host names.", "type": "string", "longdesc": "A mapping of host names to ports numbers for devices that do not support host names.-Eg. node1:1;node2:2,3 would tell the cluster to use port 1 for node1 and ports 2 and 3 for node2", "advanced": false}, {"name": "pcmk_host_list", "default": "", "required": false, "shortdesc": "A list of machines controlled by this device (Optional unless pcmk_host_check=static-list).", "type": "string", "longdesc": "A list of machines controlled by this device (Optional unless pcmk_host_check=static-list).", "advanced": false}, {"name": "pcmk_host_check", "default": "dynamic-list", "required": false, "shortdesc": "How to determine which machines are controlled by the device.", "type": "string", "longdesc": "How to determine which machines are controlled by the device.-Allowed values: dynamic-list (query the device), static-list (check the pcmk_host_list attribute), none (assume every device can fence every machine)", "advanced": false}, {"name": "pcmk_delay_max", "default": "0s", "required": false, "shortdesc": "Enable random delay for stonith actions and specify the maximum of random delay", "type": "time", "longdesc": "Enable random delay for stonith actions and specify the maximum of random delay-This prevents double fencing when using slow devices such as sbd.-Use this to enable random delay for stonith actions and specify the maximum of random delay.", "advanced": false}, {"name": "pcmk_action_limit", "default": "1", "required": false, "shortdesc": "The maximum number of actions can be performed in parallel on this device", "type": "integer", "longdesc": "The maximum number of actions can be performed in parallel on this device-Pengine property concurrent-fencing=true needs to be configured first.-Then use this to specify the maximum number of actions can be performed in parallel on this device. -1 is unlimited.", "advanced": false}, {"name": "pcmk_reboot_action", "default": "reboot", "required": false, "shortdesc": "Advanced use only: An alternate command to run instead of \'reboot\'", "type": "string", "longdesc": "Advanced use only: An alternate command to run instead of \'reboot\'-Some devices do not support the standard commands or may provide additional ones.-Use this to specify an alternate, device-specific, command that implements the \'reboot\' action.", "advanced": true}, {"name": "pcmk_reboot_timeout", "default": "60s", "required": false, "shortdesc": "Advanced use only: Specify an alternate timeout to use for reboot actions instead of stonith-timeout", "type": "time", "longdesc": "Advanced use only: Specify an alternate timeout to use for reboot actions instead of stonith-timeout-Some devices need much more/less time to complete than normal.-Use this to specify an alternate, device-specific, timeout for \'reboot\' actions.", "advanced": true}, {"name": "pcmk_reboot_retries", "default": "2", "required": false, "shortdesc": "Advanced use only: The maximum number of times to retry the \'reboot\' command within the timeout period", "type": "integer", "longdesc": "Advanced use only: The maximum number of times to retry the \'reboot\' command within the timeout period-Some devices do not support multiple connections. Operations may \'fail\' if the device is busy with another task so Pacemaker will automatically retry the operation, if there is time remaining. Use this option to alter the number of times Pacemaker retries \'reboot\' actions before giving up.", "advanced": true}, {"name": "pcmk_off_action", "default": "off", "required": false, "shortdesc": "Advanced use only: An alternate command to run instead of \'off\'", "type": "string", "longdesc": "Advanced use only: An alternate command to run instead of \'off\'-Some devices do not support the standard commands or may provide additional ones.-Use this to specify an alternate, device-specific, command that implements the \'off\' action.", "advanced": true}, {"name": "pcmk_off_timeout", "default": "60s", "required": false, "shortdesc": "Advanced use only: Specify an alternate timeout to use for off actions instead of stonith-timeout", "type": "time", "longdesc": "Advanced use only: Specify an alternate timeout to use for off actions instead of stonith-timeout-Some devices need much more/less time to complete than normal.-Use this to specify an alternate, device-specific, timeout for \'off\' actions.", "advanced": true}, {"name": "pcmk_off_retries", "default": "2", "required": false, "shortdesc": "Advanced use only: The maximum number of times to retry the \'off\' command within the timeout period", "type": "integer", "longdesc": "Advanced use only: The maximum number of times to retry the \'off\' command within the timeout period-Some devices do not support multiple connections. Operations may \'fail\' if the device is busy with another task so Pacemaker will automatically retry the operation, if there is time remaining. Use this option to alter the number of times Pacemaker retries \'off\' actions before giving up.", "advanced": true}, {"name": "pcmk_list_action", "default": "list", "required": false, "shortdesc": "Advanced use only: An alternate command to run instead of \'list\'", "type": "string", "longdesc": "Advanced use only: An alternate command to run instead of \'list\'-Some devices do not support the standard commands or may provide additional ones.-Use this to specify an alternate, device-specific, command that implements the \'list\' action.", "advanced": true}, {"name": "pcmk_list_timeout", "default": "60s", "required": false, "shortdesc": "Advanced use only: Specify an alternate timeout to use for list actions instead of stonith-timeout", "type": "time", "longdesc": "Advanced use only: Specify an alternate timeout to use for list actions instead of stonith-timeout-Some devices need much more/less time to complete than normal.-Use this to specify an alternate, device-specific, timeout for \'list\' actions.", "advanced": true}, {"name": "pcmk_list_retries", "default": "2", "required": false, "shortdesc": "Advanced use only: The maximum number of times to retry the \'list\' command within the timeout period", "type": "integer", "longdesc": "Advanced use only: The maximum number of times to retry the \'list\' command within the timeout period-Some devices do not support multiple connections. Operations may \'fail\' if the device is busy with another task so Pacemaker will automatically retry the operation, if there is time remaining. Use this option to alter the number of times Pacemaker retries \'list\' actions before giving up.", "advanced": true}, {"name": "pcmk_monitor_action", "default": "monitor", "required": false, "shortdesc": "Advanced use only: An alternate command to run instead of \'monitor\'", "type": "string", "longdesc": "Advanced use only: An alternate command to run instead of \'monitor\'-Some devices do not support the standard commands or may provide additional ones.-Use this to specify an alternate, device-specific, command that implements the \'monitor\' action.", "advanced": true}, {"name": "pcmk_monitor_timeout", "default": "60s", "required": false, "shortdesc": "Advanced use only: Specify an alternate timeout to use for monitor actions instead of stonith-timeout", "type": "time", "longdesc": "Advanced use only: Specify an alternate timeout to use for monitor actions instead of stonith-timeout-Some devices need much more/less time to complete than normal.-Use this to specify an alternate, device-specific, timeout for \'monitor\' actions.", "advanced": true}, {"name": "pcmk_monitor_retries", "default": "2", "required": false, "shortdesc": "Advanced use only: The maximum number of times to retry the \'monitor\' command within the timeout period", "type": "integer", "longdesc": "Advanced use only: The maximum number of times to retry the \'monitor\' command within the timeout period-Some devices do not support multiple connections. Operations may \'fail\' if the device is busy with another task so Pacemaker will automatically retry the operation, if there is time remaining. Use this option to alter the number of times Pacemaker retries \'monitor\' actions before giving up.", "advanced": true}, {"name": "pcmk_status_action", "default": "status", "required": false, "shortdesc": "Advanced use only: An alternate command to run instead of \'status\'", "type": "string", "longdesc": "Advanced use only: An alternate command to run instead of \'status\'-Some devices do not support the standard commands or may provide additional ones.-Use this to specify an alternate, device-specific, command that implements the \'status\' action.", "advanced": true}, {"name": "pcmk_status_timeout", "default": "60s", "required": false, "shortdesc": "Advanced use only: Specify an alternate timeout to use for status actions instead of stonith-timeout", "type": "time", "longdesc": "Advanced use only: Specify an alternate timeout to use for status actions instead of stonith-timeout-Some devices need much more/less time to complete than normal.-Use this to specify an alternate, device-specific, timeout for \'status\' actions.", "advanced": true}, {"name": "pcmk_status_retries", "default": "2", "required": false, "shortdesc": "Advanced use only: The maximum number of times to retry the \'status\' command within the timeout period", "type": "integer", "longdesc": "Advanced use only: The maximum number of times to retry the \'status\' command within the timeout period-Some devices do not support multiple connections. Operations may \'fail\' if the device is busy with another task so Pacemaker will automatically retry the operation, if there is time remaining. Use this option to alter the number of times Pacemaker retries \'status\' actions before giving up.", "advanced": true}], "name": "stonith:fence_ipmilan"}';

      default:
        return {};
    }
  });

  this.get(`/managec/${this.clusterName}/get_resource_agent_metadata`, (schema, request) => {
    switch (request.queryParams.agent) {
      case 'nagios:check_fping':
        return '{"shortdesc": "ping the specified host", "longdesc": "This plugin will use the fping command to ping the specified host for a fast check\\nThe threshold is set as pair rta,pl%, where rta is the round trip average\\ntravel time in ms and pl is the percentage of packet loss.\\nNote that it is necessary to set the suid flag on fping.", "parameters": [{"name": "hostname", "default": "", "level": "basic", "required": true, "shortdesc": "name or IP Address of host to ping (IP Address bypasses name lookup, reducing system load)", "type": "secret", "longdesc": "name or IP Address of host to ping (IP Address bypasses name lookup, reducing system load)"}, {"name": "warning", "default": "", "level": "basic", "required": false, "shortdesc": "warning threshold", "type": "string", "longdesc": "warning threshold"}, {"name": "critical", "default": "", "level": "basic", "required": false, "shortdesc": "critical threshold", "type": "string", "longdesc": "critical threshold"}, {"name": "bytes", "default": "56", "level": "advanced", "required": false, "shortdesc": "size of ICMP packet (default: 56)", "type": "integer", "longdesc": "size of ICMP packet (default: 56)"}, {"name": "number", "default": "1", "level": "advanced", "required": false, "shortdesc": "number of ICMP packets to send (default: 1)", "type": "integer", "longdesc": "number of ICMP packets to send (default: 1)"}, {"name": "target-timeout", "default": "", "level": "basic", "required": false, "shortdesc": "Target timeout (ms) (default: fping\'s default for -t)", "type": "integer", "longdesc": "Target timeout (ms) (default: fping\'s default for -t)"}, {"name": "interval", "default": "", "required": false, "shortdesc": "Interval (ms) between sending packets (default: fping\'s default for -p)", "type": "integer", "longdesc": "Interval (ms) between sending packets (default: fping\'s default for -p)"}, {"name": "extra-opts", "default": "", "required": false, "shortdesc": "ini file with extra options", "type": "string", "longdesc": "Read options from an ini file. See http://nagiosplugins.org/extra-opts\\nfor usage and examples."}], "name": "nagios:check_fping"}';
      case 'ocf:heartbeat:docker':
        return '{"shortdesc": "Docker container resource agent.", "longdesc": "The docker HA resource agent creates and launches a docker container\\nbased off a supplied docker image. Containers managed by this agent\\nare both created and removed upon the agent\'s start and stop actions.", "parameters": [{"name": "image", "default": null, "required": true, "shortdesc": "docker image", "type": "string", "longdesc": "The docker image to base this container off of."}, {"name": "name", "default": null, "required": false, "shortdesc": "docker container name", "type": "string", "longdesc": "The name to give the created container. By default this will \\nbe that resource\'s instance name."}, {"name": "allow_pull", "default": null, "required": false, "shortdesc": "Allow pulling non-local images", "type": "boolean", "longdesc": "Allow the image to be pulled from the configured docker registry when\\nthe image does not exist locally. NOTE, this can drastically increase\\nthe time required to start the container if the image repository is \\npulled over the network."}, {"name": "run_opts", "default": null, "required": false, "shortdesc": "run options", "type": "string", "longdesc": "Add options to be appended to the \'docker run\' command which is used\\nwhen creating the container during the start action. This option allows\\nusers to do things such as setting a custom entry point and injecting\\nenvironment variables into the newly created container. Note the \'-d\' \\noption is supplied regardless of this value to force containers to run \\nin the background.\\n\\nNOTE: Do not explicitly specify the --name argument in the run_opts. This\\nagent will set --name using either the resource\'s instance or the name\\nprovided in the \'name\' argument of this agent."}, {"name": "run_cmd", "default": null, "required": false, "shortdesc": "run command", "type": "string", "longdesc": "Specifiy a command to launch within the container once \\nit has initialized."}, {"name": "monitor_cmd", "default": null, "required": false, "shortdesc": "monitor command", "type": "string", "longdesc": "Specifiy the full path of a command to launch within the container to check\\nthe health of the container. This command must return 0 to indicate that\\nthe container is healthy. A non-zero return code will indicate that the\\ncontainer has failed and should be recovered.\\n\\nThe command is executed using nsenter. In the future \'docker exec\' will\\nbe used once it is more widely supported."}, {"name": "force_kill", "default": null, "required": false, "shortdesc": "force kill", "type": "boolean", "longdesc": "Kill a container immediately rather than waiting for it to gracefully\\nshutdown"}, {"name": "reuse", "default": null, "required": false, "shortdesc": "reuse container", "type": "boolean", "longdesc": "Allow the container to be reused after stopping the container. By default\\ncontainers are removed after stop. With the reuse option containers\\nwill persist after the container stops."}], "name": "ocf:heartbeat:docker"}';
      default:
        return {};
    }
  });

  this.post('/nodes', (schema, request) => {
    const params = JSON.parse(request.requestBody);
    // @note: we have just one cluster with this ID
    params.clusterId = 1;

    return schema.nodes.create(params);
  });

  this.post('/managec/my/update_cluster_settings', function updateClusterSettings(schema, request) {
    const cluster = schema.clusters.find(1);
    const attrs = this.normalizedRequestAttrs();

    Object.keys(attrs).forEach((i) => {
      schema.db.properties.update({ name: i }, { value: attrs[i] });
    });

    // @todo: remove property when attrs[i] is empty (share with fence properties?)
    return cluster;
  });

  this.post('/managec/my/update_fence_device', function updateFenceDevice(schema, request) {
    const attrs = this.normalizedRequestAttrs();
    let fence;

    if (!('resource_id' in attrs)) {
      // Create new fence agent
      const cluster = schema.clusters.find(1);
      fence = cluster.createFence({
        name: attrs._res_paramne_name,
        agentType: attrs.resource_type,
      });

      delete attrs._res_paramne_name;
    } else {
      [fence] = schema.fences.where({ name: attrs.resource_id }).models;
    }

    delete attrs.resource_id;
    delete attrs.resource_type;

    Object.keys(attrs).forEach((i) => {
      const cleanName = i.replace(/^_res_paramne_/, '');

      let propToUpdate = schema.fenceProperties
        .all()
        .filter(x => x.name === `${cleanName}` && x.resourceId === fence.attrs.id);

      if (propToUpdate === null || propToUpdate.models.length === 0) {
        propToUpdate = fence.createProperty({
          name: cleanName,
        });
      }

      if (attrs[i] === '') {
        // @note: Following line is just work-around for eslint-prettifier bug
        const r = fence.propertyIds;
        fence.fencePropertiesIds = r.filter(item => item !== propToUpdate.id);
        fence.save();

        propToUpdate.update('fence', null);
        propToUpdate.destroy();
      } else {
        propToUpdate.update('value', attrs[i]);
        propToUpdate.save();
      }
    });

    return fence;
  });

  this.post('/managec/my/add_group', function addGroup(schema, request) {
    const attrs = this.normalizedRequestAttrs();
    return _createEnvelopeResource(schema, attrs, attrs.resources.split(' '), {
      name: attrs.resource_group,
      resourceType: 'group',
    });
  });

  this.post('/managec/my/update_resource', function updateResource(schema, request) {
    const attrs = this.normalizedRequestAttrs();
    const cluster = schema.clusters.find(1);
    let resourceId;
    let resource;
    if (!('resource_id' in attrs)) {
      // Create new fence agent
      // @todo: proper fix instead of this naive solution that does not work always
      const agentType = attrs.resource_type.split(':');
      resource = cluster.createResource({
        name: attrs._res_paramne_resourceName,
        resourceType: 'primitive',
        agentType: agentType[agentType.length - 1],
        resourceProvider: agentType.slice(0, agentType.length - 1).join(':'),
      });
      resourceId = resource.id;

      delete attrs._res_paramne_name;
    } else {
      resourceId = schema.resources.where({ name: attrs.resource_id }).models[0].attrs.id;
      [resource] = schema.resources.where({ name: attrs.resource_id }).models;
    }

    if (attrs.resource_clone === 'on') {
      _createEnvelopeResource(schema, attrs, [schema.resources.find(resourceId).attrs.name], {
        name: `${attrs._res_paramne_resourceName}-clone`,
        resourceType: 'clone',
      });
    }

    if (attrs.resource_ms === 'on') {
      _createEnvelopeResource(schema, attrs, [schema.resources.find(resourceId).attrs.name], {
        name: `${attrs._res_paramne_resourceName}-master`,
        resourceType: 'masterslave',
      });
    }

    delete attrs.resource_id;
    delete attrs.resource_type;
    delete attrs.resource_clone;

    Object.keys(attrs).forEach((i) => {
      const cleanName = i.replace(/^_res_paramne_/, '');

      let propToUpdate = schema.resourceProperties.findBy({
        name: cleanName,
        resourceId: resource.attrs.id,
      });

      if (propToUpdate === null) {
        propToUpdate = resource.createProperty({
          name: cleanName,
        });
      }

      if (attrs[i] === '') {
        // @note: Following line is just work-around for eslint-prettifier bug
        const r = resource.propertyIds;
        resource.resourcePropertiesIds = r.filter(item => item !== propToUpdate.id);
        resource.save();

        propToUpdate.update('resource', null);
        propToUpdate.destroy();
      } else {
        propToUpdate.update('value', attrs[i]);
        propToUpdate.save();
      }
    });

    return resource;
  });

  this.post('/managec/my/remove_resource', function removeResource(schema, request) {
    const attrs = this.normalizedRequestAttrs();
    const cluster = schema.clusters.find(1);
    Object.keys(attrs).forEach((i) => {
      const name = i.substring(6, i.length);
      if (i.startsWith('resid_')) {
        const resourceId = schema.resources.where({ name }).models[0].attrs.id;

        // @note: hack for eslint-pretifier, feel free to remove if travis pass :)
        const r = cluster.resourceIds;
        cluster.resourceIds = r.filter(item => item !== resourceId);
        cluster.save();

        schema.db.resources.remove({ name });
      } else if (i.startsWith('resid-')) {
        const resourceId = schema.fences.where({ name }).models[0].attrs.id;

        // @note: hack for eslint-pretifier, feel free to remove if travis pass :)
        const r = cluster.fenceIds;
        cluster.fenceIds = r.filter(item => item !== resourceId);
        cluster.save();
      }
    });
  });

  this.post('/managec/my/resource_clone', function resourceClone(schema, request) {
    const attrs = this.normalizedRequestAttrs();
    _createEnvelopeResource(schema, attrs, [attrs.resource_id], {
      name: `${attrs.resource_id}-clone`,
      resourceType: 'clone',
    });
  });

  this.post('/managec/my/resource_unclone', function resourceUnclone(schema, request) {
    _releaseResource(schema, this.normalizedRequestAttrs());
  });

  this.post('/managec/my/resource_ungroup', function resourceUngroup(schema, request) {
    _releaseResource(schema, this.normalizedRequestAttrs());
  });

  this.post('/managec/my/add_meta_attr_remote', function addMetaAttrRemote(schema, request) {
    const params = this.normalizedRequestAttrs();
    const resource = schema.resources.where({ name: params.res_id }).models[0];

    // @todo: update responses to match backend
    if (params.key === 'force') {
      if (!(params.force === 'true')) {
        return new Response(
          400,
          { 'Content-Type': 'text/text' },
          'Error adding constraint: Error: duplicate constraint already exists, use --force to override. <br />Started attacking_clones-clone loss-policy=fence ticket=foo (id:ticket-foo-attacking_clones-clone-Started)',
        );
      }
    } else if (params.key === 'error') {
      return new Response(400, { 'Content-Type': 'text/text' }, 'Error Error Error');
    } else if (params.key === 'delete' && params.value === '') {
      return new Response(400, { 'Content-Type': 'text/text' }, 'Unable to delete');
    }

    return _cudAttribute(resource, params, resource.metaAttributeIds, schema.attributes, 'key', x =>
      resource.createMetaAttribute(x));
  });

  this.post('/managec/my/set_resource_utilization', function setResourceUtilization(
    schema,
    request,
  ) {
    const params = this.normalizedRequestAttrs();
    const resource = schema.resources.where({ name: params.resource_id }).models[0];

    // @todo: update responses to match backend
    if (params.name === 'force') {
      if (!(params.force === 'true')) {
        return new Response(
          400,
          { 'Content-Type': 'text/text' },
          'Error adding constraint: Error: duplicate constraint already exists, use --force to override. <br />Started attacking_clones-clone loss-policy=fence ticket=foo (id:ticket-foo-attacking_clones-clone-Started)',
        );
      }
    } else if (params.name === 'error') {
      return new Response(400, { 'Content-Type': 'text/text' }, 'Error Error Error');
    }

    return _cudAttribute(
      resource,
      params,
      resource.utilizationAttributeIds,
      schema.utilizationAttributes,
      'name',
      x => resource.createUtilizationAttribute(x),
    );
  });

  this.post('/managec/my/add_node_attr_remote', function addMetaAttrRemote(schema, request) {
    const params = this.normalizedRequestAttrs();
    const node = schema.nodes.where({ name: params.node }).models[0];

    // @todo: update responses to match backend
    if (params.key === 'force') {
      if (!(params.force === 'true')) {
        return new Response(
          400,
          { 'Content-Type': 'text/text' },
          'Error adding constraint: Error: duplicate constraint already exists, use --force to override. <br />Started attacking_clones-clone loss-policy=fence ticket=foo (id:ticket-foo-attacking_clones-clone-Started)',
        );
      }
    } else if (params.key === 'error') {
      return new Response(400, { 'Content-Type': 'text/text' }, 'Error Error Error');
    } else if (params.key === 'delete' && params.value === '') {
      return new Response(400, { 'Content-Type': 'text/text' }, 'Unable to delete');
    }

    return _cudAttribute(node, params, node.nodeAttributeIds, schema.nodeAttributes, 'key', x =>
      node.createNodeAttribute(x));
  });

  this.post('/managec/my/set_node_utilization', function setResourceUtilization(schema, request) {
    const params = this.normalizedRequestAttrs();
    const node = schema.nodes.where({ name: params.node }).models[0];

    // @todo: update responses to match backend
    if (params.name === 'force') {
      if (!(params.force === 'true')) {
        return new Response(
          400,
          { 'Content-Type': 'text/text' },
          'Error adding constraint: Error: duplicate constraint already exists, use --force to override. <br />Started attacking_clones-clone loss-policy=fence ticket=foo (id:ticket-foo-attacking_clones-clone-Started)',
        );
      }
    } else if (params.name === 'error') {
      return new Response(400, { 'Content-Type': 'text/text' }, 'Error Error Error');
    }

    return _cudAttribute(
      node,
      params,
      node.nodeUtilizationAttributeIds,
      schema.nodeUtilizationAttributes,
      'name',
      x => node.createNodeUtilizationAttribute(x),
    );
  });

  this.post('/managec/my/add_constraint_remote', function addConstraintRemote(schema, request) {
    const params = this.normalizedRequestAttrs();
    const resource = schema.resources.where({ name: params.res_id }).models[0];

    if (params.c_type === 'loc') {
      const attribute = _getRecordByKey(
        params,
        resource.locationPreferenceIds,
        schema.locationPreferences,
        'node_id',
      );

      if (attribute && params.score === undefined) {
        return attribute.destroy();
      } else if (attribute) {
        return attribute.update('score', params.score);
      }
      const preference = resource.createLocationPreference({
        preferenceID: `location-${counterID}`,
        node: params.node_id,
        ...params,
      });
      counterID += 1;
      return preference;
    } else if (params.c_type === 'col') {
      const attribute = _getRecordByKey(
        params,
        resource.colocationPreferenceIds,
        schema.colocationPreferences,
        'target_res_id',
      );

      if (attribute && (params.score === undefined || params.score === '')) {
        return attribute.destroy();
      } else if (attribute) {
        // @note: do we need update?
      } else {
        const preference = resource.createColocationPreference({
          preferenceID: `colocation-${counterID}`,
          targetResource: params.target_res_id,
          colocationType: params.colocation_type,
          score: params.score,
        });
        counterID += 1;
        return preference;
      }
    } else if (params.c_type === 'ord') {
      // @note: pcs_id can be same for several items when only action differs,
      // this is not an issue in a real backend always create a new one
      // @todo - look at real response in case of 'duplicity'
      const preference = resource.createOrderingPreference({
        preferenceID: `ordering-${counterID}`,
        targetResource: params.target_res_id,
        targetAction: params.target_action,
        action: params.res_action,
        order: params.order,
        score: params.score,
      });
      counterID += 1;
      return preference;
    } else if (params.c_type === 'ticket') {
      // always create - as for 'ord'
      const preference = resource.createTicketPreference({
        preferenceID: `ticket-${counterID}`,
        ticket: params.ticket,
        role: params.role,
        lossPolicy: params['loss-policy'],
      });
      counterID += 1;
      return preference;
    }
    return undefined;
  });

  this.post('/managec/my/add_constraint_set_remote', function addConstraintSetRemote(
    schema,
    request,
  ) {
    const params = this.normalizedRequestAttrs();

    const cluster = schema.clusters.find(1);
    const constraintSet = cluster.createConstraintSet({
      type: params.c_type,
      preferenceID: `set-${counterID}`,
      ticket: params['options%5Bticket%5D'],
      lossPolicy: params['options%5Bloss-policy%5D'],
    });
    counterID += 1;

    Object.keys(params).forEach((p) => {
      if (p.startsWith('resources[')) {
        //        const index = p.slice(10, -1);
        const resourceSet = constraintSet.createResourceSet();
        resourceSet.save();
        params[p].forEach((resourceName) => {
          const resource = schema.resources.where({ name: resourceName }).models[0];
          const z = resourceSet.resourceIds;
          z.push(resource.id);
          resourceSet.resourceIds = z;
          resourceSet.save();
        });
      }
      constraintSet.save();
    });

    return constraintSet;
  });

  this.post('/managec/my/remove_constraint_remote', function removeConstraintRemote(
    schema,
    request,
  ) {
    const params = this.normalizedRequestAttrs();
    const constraintType = params.constraint_id.split('-')[0];
    const schemaMapping = {
      location: schema.locationPreferences,
      colocation: schema.colocationPreferences,
      ordering: schema.orderingPreferences,
      ticket: schema.ticketPreferences,
      set: schema.constraintSets,
    };
    const constraint = schemaMapping[constraintType].where({ preferenceID: params.constraint_id })
      .models[0];

    constraint.destroy();
  });

  this.post('/managec/my/resource_master', function resourceMaster(schema, request) {
    const attrs = this.normalizedRequestAttrs();
    _createEnvelopeResource(schema, attrs, [attrs.resource_id], {
      name: `${attrs.resource_id}-master`,
      resourceType: 'masterslave',
    });
  });

  this.post('/login', function login(schema, request) {
    const attrs = this.normalizedRequestAttrs();

    if (attrs.username === 'hacluster' && attrs.password === 'hacluster') {
      return new Response(200);
    }
    return new Response(400);
  });
  this.get('/logout', () => {
    this.authenticated = false;
  });
  this.get('/login-status', () => {
    if (this.authenticated) {
      return new Response(200);
    }
    return new Response(400);
  });

  this.post('/managec/my/add_acl_role', function addAclRole(schema, request) {
    const attrs = this.normalizedRequestAttrs();
    const cluster = schema.clusters.find(1);

    const role = cluster.createAclRole({
      name: attrs.name,
      description: attrs.description,
    });

    return role;
  });

  this.post('/managec/my/remove_acl_roles', function removeAclRoles(schema, request) {
    const params = this.normalizedRequestAttrs();
    const role = schema.aclRoles.where({ name: params['role-0'] }).models[0];
    role.destroy();
  });

  this.post('/managec/my/add_acl', function addAcl(schema, request) {
    const attrs = this.normalizedRequestAttrs();
    const role = schema.aclRoles.where({ name: attrs.role_id }).models[0];

    if (attrs.item === 'permission') {
      const permission = role.createPermission({
        permissionID: `location-${counterID}`,
        operation: attrs.operation,
        query: attrs.query,
        xpath: attrs.xpath,
      });
      counterID += 1;
      return permission;
    } else if (attrs.item === 'user') {
      // @todo?: test if aclUser does not exists in cluster
      // @todo?: test if user is not already in the role
      role.createUser({
        name: attrs.usergroup,
      });

      return role;
    } else if (attrs.item === 'group') {
      // @todo: same concerns as in 'user'
      role.createGroup({
        name: attrs.usergroup,
      });

      return role;
    }
    return undefined;
  });

  this.post('/managec/my/remove_acl', function removeAcl(schema, request) {
    const attrs = this.normalizedRequestAttrs();

    if (attrs.item === 'permission') {
      const permission = schema.aclPermissions.where({ permissionID: attrs.acl_perm_id }).models[0];
      return permission.destroy();
    } else if (attrs.item === 'usergroup' && ['user', 'group'].includes(attrs.item_type)) {
      const schemas = {
        user: schema.aclUsers,
        group: schema.aclGroups,
      };

      let usedInOtherRole = false;
      const role = schema.aclRoles.where({ name: attrs.role_id }).models[0];
      const fk = `${attrs.item_type}Ids`;
      const element = schemas[attrs.item_type].where({
        name: attrs.usergroup_id,
      }).models[0];

      schema.aclRoles.all().models.forEach((r) => {
        if (r.name === role.name) {
          role[fk] = role[fk].filter(item => item !== element.id);
          role.save();
        } else if (role[fk].includes(element.id)) {
          usedInOtherRole = true;
        }
      });

      if (!usedInOtherRole) {
        // remove only when element is not used in any roles
        element.destroy();
      }

      return role;
    }
    return undefined;
  });

  this.post('/managec/my/mock/get-list', (schema, request) => ({
    plug01: 'alias for this plug',
    plug02: 'other alias',
  }));
}
