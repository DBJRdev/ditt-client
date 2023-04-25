const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const VisualizerPlugin = require('webpack-visualizer-plugin2');
const webpack = require('webpack');
const { TITLE } = require('./config/envspecific');

module.exports = (env, argv) => {
  const modeArgument = argv.mode;

  return {
    devServer: {
      historyApiFallback: true,
      host: '0.0.0.0',
      static: Path.join(__dirname, 'public'),
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
          resolve: {
            fullySpecified: false,
          },
          test: /\.m?js/,
        },
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
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  includePaths: ['node_modules'],
                },
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                titleProp: true,
              },
            },
          ],
        },
      ],
    },
    output: {
      filename: '[name].js?v=__ASSET_VERSION__',
      path: Path.join(__dirname, 'public/generated'),
      publicPath: '/generated/',
    },
    performance: {
      hints: modeArgument === 'production' ? 'error' : false,
      maxAssetSize: 1500000,
      maxEntrypointSize: 1500000,
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
      new HtmlWebpackPlugin({
        filename: Path.join(__dirname, 'public/index.html'),
        minify: false,
        template: Path.join(__dirname, 'templates/index.html'),
        title: TITLE,
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
