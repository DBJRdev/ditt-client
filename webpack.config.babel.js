const path = require('path');

module.exports = [{
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
        test: /\.(svg)$/,
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
    extensions: ['.js', '.jsx', '.scss'],
    modules: ['src', 'node_modules'],
  },
}];
