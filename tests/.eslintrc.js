module.exports = {
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  env: {
    embertest: true,
  },
  settings: {
    'import/core-modules': ['ember', 'ember-qunit', 'qunit', 'htmlbars-inline-precompile', 'picus'],
  },
  rules: {
    'no-unused-vars': ['error', { args: 'none' }],
    'func-names': ['error', 'never'],
    'no-restricted-globals': ['off', 'find'],
  },
  globals: {
    server: true,
  },
};
