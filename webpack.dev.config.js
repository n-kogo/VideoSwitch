'use strict';

const path = require('path');
var commonConfig = require('./webpack.common.config');


var output = {
  filename: 'bundle.js',
  sourceMapFilename: '[file].map',
  path: path.resolve(__dirname, 'build'),
  publicPath: '/assets/'
};


module.exports = Object.assign(commonConfig, {
  entry: [
    './src/index.ts',
    // 'webpack-dev-server/client?http://localhost:8080'
  ],
  devtool: 'source-map',
  output: output,
  devServer: {
    open: true, // to open the local server in browser
    contentBase: __dirname + '/',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.tsx', 'js' ]
  }
});
