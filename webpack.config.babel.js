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
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['src', 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.join(__dirname, 'src'),
        use: [{ loader: 'babel-loader' }],
      },
    ],
  },
  output: {
    publicPath: '/generated/',
    path: path.join(__dirname, 'public/generated'),
    filename: '[name].js',
  },
}];
