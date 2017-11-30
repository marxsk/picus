module.exports = {
  root: true,
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    },
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  env: {
    browser: true
  },
  rules: {
    "no-unused-vars": [ "error", { "args": "none" }]
  },
  globals: {
    "server": true,
    "emberFormForFind": true
  }
};
