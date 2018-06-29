import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

Router.map(function router() {
  this.route('login');

  this.route('cluster', { path: 'cluster/:cluster_name' }, function clusterRouter() {
    // @todo: to solve - cluster that we don't know about
    this.route('properties');

    this.route('nodes', function nodesRouter() {
      this.route('listing', { path: 'show/' });
      this.route('show', { path: 'show/:node_name' });
      this.route('create');
    });

    this.route('resources', function resourcesRouter() {
      this.route('listing', { path: 'show/' });
      this.route('show', { path: 'show/:resource_name' });
      this.route('create');
      this.route('createGroup', { path: 'create-group' });
    });

    this.route('fences', function fencesRouter() {
      this.route('listing', { path: 'show/' });
      this.route('show', { path: 'show/:fence_name' });
      this.route('create');
      this.route('wizard');
    });

    this.route('acl', function aclRouter() {
      this.route('role', { path: 'role/:role_name' });
    });
    this.route('testAuth');
  });
  this.route('error');

  this.route('create-cluster');

  return true;
});

export default Router;
