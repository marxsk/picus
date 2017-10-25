/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    babel: {
      optional: ['es6.spec.symbols'],
    },

    'ember-bootstrap': {
      'bootstrapVersion': 3,
      'importBootstrapFont': true,
      'importBootstrapCSS': false
    },

    'ember-cli-babel': {
      includePolyfill: true,
    }
  });

  return app.toTree();
};
