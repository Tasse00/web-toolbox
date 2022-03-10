// const { when } = require("@craco/craco");
const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {

      // webpack v5 breaking change
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        assert: require.resolve("assert"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        url: require.resolve("url/"),
        buffer: require.resolve('buffer/'),
        os: require.resolve("os-browserify/browser"),
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve('stream-browserify'),
      }

      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        // Work around for Buffer is undefined:
        // https://github.com/webpack/changelog-v5/issues/10
          new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
      ]

      return webpackConfig;
    }
  }
}