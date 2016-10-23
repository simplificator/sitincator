var webpack = require('webpack');

module.exports = {
  context: __dirname + '/src',
  entry: './entry.js',

  output: {
    filename: 'bundle.js',
    path: __dirname + '/build',
    publicPath: 'http://localhost:8080/build/'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-0', 'react']
        }
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!resolve-url-loader!sass-loader'
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      }
    ]
  },

  target: 'electron-renderer',

  devtool: 'eval-sourcemap',
};
