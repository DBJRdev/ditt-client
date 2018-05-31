const path = require('path');

module.exports = [{
  devServer: {
    contentBase: './public',
    disableHostCheck: true,
    historyApiFallback: true,
    inline: true,
  },
  entry: {
    bundle: ['babel-polyfill', path.join(__dirname, 'src/main.jsx')],
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
          { loader: 'css-loader?importLoaders=2&modules&localIdentName=[name]__[local]___[hash:base64:5]' },
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
