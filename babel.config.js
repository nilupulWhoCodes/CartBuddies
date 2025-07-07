const { resolve } = require('path');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],

    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@@': resolve(__dirname, 'src'), // Alias for the 'src' directory
            '@assets': resolve(__dirname, 'assets'), // Alias for the 'assets' directory
          },
          extensions: [
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.json',
            '.svg', // Existing supported extensions
            '.png',
            '.jpg',
            '.jpeg', // Add image extensions
          ],
        },
      ],
      ['react-native-reanimated/plugin'],
    ],
  };
};
