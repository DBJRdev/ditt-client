const path = require('path');

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
    devtool: 'eval-cheap-module-source-map',
    entry: {
      bundle: [
        'core-js',
        'whatwg-fetch',
        path.join(__dirname, 'src/main.jsx'),
      ],
    },
    module: {
      rules: [
        {
          include: path.join(__dirname, 'src'),
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
                  localIdentName: '[name]__[local]__[hash:base64:5]',
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
      path: path.join(__dirname, 'public/generated'),
      publicPath: '/generated/',
    },
    resolve: {
      alias: {
        // Allow to run react-ui in development mode for easier development
        '@react-ui-org/react-ui$': modeArgument === 'production'
          ? '@react-ui-org/react-ui/dist/lib.js'
          : '@react-ui-org/react-ui/dist/lib.development.js',

        // Force react-ui to use the same react instance as the app when using `npm link`
        // See: https://github.com/react-ui-org/react-ui#package-linking
        react: path.resolve('./node_modules/react'),
        'react-dom': path.resolve('./node_modules/react-dom'),
      },
      extensions: ['.js', '.jsx', '.scss'],
      modules: ['src', 'node_modules'],
    },
  };
};
