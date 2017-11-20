/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'picus',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    changeTracker: {
      enableIsDirty: true,
      auto: true,
      trackHasMany: true,
    },

    'ember-cli-notifications': {
      includeFontAwesome: true
    },

    'ember-form-for': {
          fieldClasses: 'form-group',
          fieldHasErrorClasses: 'has-error',
          inputClasses: 'form-control',
          hintClasses: '',
          errorClasses: 'alert alert-danger',
          errorsPath: 'error.PROPERTY_NAME.validation',
    },

    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_TRANSITIONS = false;
    ENV.APP.LOG_TRANSITIONS_INTERNAL = false;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  ENV['ember-cli-mirage'] = {
    enabled: true
  }

  return ENV;
};
