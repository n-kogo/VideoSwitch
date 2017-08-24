'use strict';
//require
const path = require('path');
const webpack = require('webpack');

//isproduction
var isProduction = process.argv.indexOf('-p') >= 0;
// var isProduction = process.env.NODE_ENV == 'production';

// plugins
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

//paths
var sourcePath = path.join(__dirname, './src');
var outputPath = path.join(__dirname, './dist');


var output = {
  filename: isProduction ? 'bundle.[chunkhash].js': 'bundle.js',
  sourceMapFilename: '[file].map',
  path: outputPath,
  publicPath: '/'
};


module.exports = {
  context: sourcePath,
  entry: {
    main: './index.tsx',
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux'
    ]
  },
  devtool: isProduction ? '': 'source-map',
  output: output,
  target: 'web',
  resolve: {
    extensions: [ '.ts', '.tsx', '.js'],
    mainFields: ['main']
  },
  module: {
    loaders: [
      { test: /\.ts(x?)$/, loader: 'babel-loader!ts-loader' },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use:'css-loader!sass-loader'
        })
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
      },
      {
        test:/\.json$/,
        use: [
          'json-loader'
        ]
      }

    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: isProduction ? 'vendor.bundle.[chunkhash].js': 'vendor.bundle.js',
      minChunks: Infinity
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      hash: false,
    }),
    new ExtractTextPlugin({
      filename: 'styles.css',
      disable: !isProduction
    }),
    new webpack.DefinePlugin({
      STATS_URL: (isProduction ? "'https://stats.le-refuge-des-souvenirs.fr:8443'" : "'http://localhost:1337'"),
    }),
    // new webpack.optimize.UglifyJsPlugin({
    // })
  ],
  devServer: {
    // open: true, // to open the local server in browser
    historyApiFallback: true,
    contentBase: sourcePath,
    hot: true
  },
  node: {
    fs: 'empty',
    net: 'empty'
  }
};

// console.log(require('util').inspect(module.exports, {colors: true}))
