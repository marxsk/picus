module.exports = {
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    },
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  env: {
    embertest: true
  },
  rules: {
    "no-unused-vars": [ "error", { "args": "none" }]
  },
  globals: {
    "server": true
  }
};
