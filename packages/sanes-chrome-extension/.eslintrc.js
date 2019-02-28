const baseConfig = require("../../.eslintrc");

module.exports = {
  ...baseConfig,
  env: {
    webextensions: true,
  },
};
