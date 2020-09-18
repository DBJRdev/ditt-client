const Path = require('path');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const VisualizerPlugin = require('webpack-visualizer-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const modeArgument = argv.mode;

  return {
    devServer: {
      contentBase: './public',
      disableHostCheck: true,
      historyApiFallback: true,
      host: '0.0.0.0',
      inline: true,
    },
    devtool: modeArgument === 'development'
      ? 'eval-cheap-module-source-map'
      : false,
    entry: {
      bundle: [
        Path.join(__dirname, 'src/main.jsx'),
      ],
    },
    module: {
      rules: [
        {
          exclude: /node_modules/,
          include: Path.join(__dirname, 'src'),
          test: /\.(js|jsx)$/,
          use: [{ loader: 'babel-loader' }],
        },
        {
          test: /\.scss$/,
          use: [
            { loader: 'style-loader' },
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: modeArgument === 'production'
                    ? '[hash:base64:8]'
                    : '[name]__[local]__[hash:base64:8]',
                },
              },
            },
            { loader: 'postcss-loader' },
            { loader: 'sass-loader' },
          ],
        },
        {
          test: /\.svg$/,
          use: [
            { loader: 'file-loader?hash=sha512&digest=hex&name=[hash].[ext]' },
            { loader: 'image-webpack-loader?bypassOnDebug' },
          ],
        },
      ],
    },
    output: {
      filename: '[name].js',
      path: Path.join(__dirname, 'public/generated'),
      publicPath: '/generated/',
    },
    plugins: [
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /de|en/),
      new StyleLintPlugin({
        configFile: 'stylelint.config.js',
        syntax: 'scss',
      }),
      new VisualizerPlugin({
        filename: '../../stats.html',
      }),
    ],
    resolve: {
      alias: {
        // Allow to run react-ui in development mode for easier development
        '@react-ui-org/react-ui$': modeArgument === 'production'
          ? '@react-ui-org/react-ui/dist/lib.js'
          : '@react-ui-org/react-ui/dist/lib.development.js',

        // Force react-ui to use the same react instance as the app when using `npm link`
        // See: https://github.com/react-ui-org/react-ui#package-linking
        react: Path.resolve('./node_modules/react'),
        'react-dom': Path.resolve('./node_modules/react-dom'),

        // Force usage of es module to allow strict CORS settings
        'redux-api-middleware': 'redux-api-middleware/es',
      },
      extensions: ['.js', '.jsx', '.scss'],
      modules: ['src', 'node_modules'],
    },
  };
};
