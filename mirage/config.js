import Response from 'ember-cli-mirage/response';
import jsonClusterOverview from './static-data/clusters_overview';
import jsonFenceApc from './static-data/fence_apc';
import jsonFenceIpmilan from './static-data/fence_ipmilan';
import jsonResourceFping from './static-data/resource_fping';
import jsonResourceDocker from './static-data/resource_docker';

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

  this.get('/clusters_overview', () => jsonClusterOverview);
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
        return jsonFenceApc;
      case 'stonith:fence_ipmilan':
        return jsonFenceIpmilan;
      default:
        return {};
    }
  });

  this.get(`/managec/${this.clusterName}/get_resource_agent_metadata`, (schema, request) => {
    switch (request.queryParams.agent) {
      case 'nagios:check_fping':
        return jsonResourceFping;
      case 'ocf:heartbeat:docker':
        return jsonResourceDocker;
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

  this.post('/xyz', function xyz(schema, request) {
    const attrs = this.normalizedRequestAttrs();

    if (attrs.nodename === 'fail') {
      return new Response(400);
    }
    return new Response(200, { 'Content-Type': 'text/plain' }, 'Everything was ok');
  });
}
