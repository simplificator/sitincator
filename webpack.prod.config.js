const webpack = require('webpack');
const prodConfig = require('./webpack.config');

prodConfig.devtool = 'cheap-module-source-map';

prodConfig.plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  })
]

prodConfig.output = {
  filename: 'bundle.js',
  path: __dirname + '/build',
  publicPath: './build/'
}

module.exports = prodConfig;
