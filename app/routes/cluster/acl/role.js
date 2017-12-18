import Ember from 'ember';
import TabRoute from 'picus/routes/tab-route';
import { validatePresence } from 'ember-changeset-validations/validators';

export default TabRoute.extend({
  notifications: Ember.inject.service('notifications'),

  aclRole: undefined,

  setupController(controller, model) {
    this._super(controller, model);
    // hide sidebar menu
    this.controllerFor('application').set('hideMainMenu', true);
  },

  model(params) {
    const aclRole = this.store.peekRecordQueryName('aclRole', params.role_name);

    this.set('aclRole', aclRole);

    const validations = {
      addPermission: {
        query: validatePresence(true),
      },
    };

    return Ember.RSVP.hash({
      updatingCluster: this.store.peekAll('cluster'),
      aclRole,
      params,
      validations,
    });
  },

  actions: {
    addPermission(form) {
      const permission = this.get('store').createRecord('acl-permission', {
        role: this.get('aclRole'),
        operation: form.get('operation'),
        xpath: form.get('xpath'),
        query: form.get('query'),
      });
      return this.get('notifications').notificationSaveRecord(permission, 'ADD_ACL_PERMINISSION');
    },
    deletePermission(actionName, permission) {
      permission.deleteRecord();
      this.get('notifications').notificationSaveRecord(permission, actionName);
    },
    addUser(form) {
      // @todo: do not create user when there is an old one with same name
      const aclUser = this.get('store').createRecord('acl-user', {
        name: form.get('name'),
      });
      // @todo: detection of duplicates users in same role also in front-end?
      this.get('aclRole.users').pushObject(aclUser);
      return this.get('notifications').notificationSaveRecord(
        this.get('aclRole'),
        'ADD_USER_TO_ACL_ROLE',
      );
    },
    deleteUser(actionName, user) {
      this.get('aclRole.users').removeObject(user);
      return this.get('notifications').notificationSaveRecord(
        this.get('aclRole'),
        'REMOVE_USER_FROM_ACL_ROLE',
      );
    },
    deleteRole(role) {
      role.deleteRecord();
      this.transitionTo('cluster.acl.index');
      return this.get('notifications').notificationSaveRecord(role, 'DELETE_ACL_ROL');
    },
    addGroup(form) {
      const aclGroup = this.get('store').createRecord('acl-group', {
        name: form.get('name'),
      });
      // @todo: (as in addUser) detection of duplicates users in same role also in front-end?
      this.get('aclRole.groups').pushObject(aclGroup);
      return this.get('notifications').notificationSaveRecord(
        this.get('aclRole'),
        'ADD_GROUP_TO_ACL_ROLE',
      );
    },
    deleteGroup(actionName, group) {
      this.get('aclRole.groups').removeObject(group);
      return this.get('notifications').notificationSaveRecord(
        this.get('aclRole'),
        'REMOVE_GROUP_FROM_ACL_ROLE',
      );
    },
  },
});
