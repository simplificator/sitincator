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
module.exports = prodConfig;
