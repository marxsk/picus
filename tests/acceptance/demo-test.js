import { test } from 'qunit';
import moduleForAcceptance from 'picus/tests/helpers/module-for-acceptance';
import defaultScenario from '../../mirage/scenarios/default';
import startApp from '../helpers/start-app';
import Ember from 'ember';

var application;

let mockTickTock = Ember.Service.extend({
    now: 111,
});

moduleForAcceptance('Acceptance | singel', {
  beforeEach: function() {
    server.shutdown();

    application = startApp();
    application.register('service:mockTickTock', mockTickTock);
    application.inject('service:store', 'ticktock', 'service:mockTickTock');
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});


test('visiting /cluster/my/resources/show/resource-ping', function(assert) {
  defaultScenario(server);

  visit('/cluster/my/resources/show/resource-ping');

  andThen(function() {
    assert.equal(currentURL(), '/cluster/my/resources/show/resource-ping');
  });
});
