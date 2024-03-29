const { getDefaultConfig } = require('metro-config');

module.exports = async () => {
  const defaultConfig = await getDefaultConfig();

  // Add TypeScript file extension support
  defaultConfig.resolver.extensions.push('.ts', '.tsx');

  // Add TypeScript transformer
  defaultConfig.transformer.babelTransformerPath = require.resolve('metro-react-native-babel-preset');

  return defaultConfig;
};
