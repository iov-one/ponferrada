const { resolve } = require("path");

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('babel-loader'),
    options: {
      presets: [['react-app', { flow: false, typescript: true }]]
    }
  });
  config.resolve.extensions.push('.ts', '.tsx');
  config.resolve.alias = {
    ...config.resolve.alias,
    "~": resolve(process.cwd(), "..", "medulas-react-components", "src"),
  }

  return config;
};
