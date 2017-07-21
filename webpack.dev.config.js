'use strict';

const path = require('path');
var commonConfig = require('./webpack.common.config');

var output = {
  filename: 'bundle.js',
  sourceMapFilename: '[file].map',
  path: path.resolve(__dirname, 'dist'),
  publicPath: '/assets/'
};


module.exports = Object.assign(commonConfig, {
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
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: [':data-src']
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }

    ]
  },
  resolve: {
    extensions: [ '.ts', '.tsx', '.js']
  }
});

console.log(require('util').inspect(module.exports, {colors: true}))
