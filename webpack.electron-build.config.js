'use strict';
//electron specific
const { spawn } = require('child_process');

//require
const path = require('path');
const webpack = require('webpack');
// plugins
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

//paths
var sourcePath = path.join(__dirname, './src');
var outputPath = path.join(__dirname, './dist-electron');

//isproduction
var isProduction = process.argv.indexOf('-p') >= 0;

const defaultInclude = [sourcePath];

var output = {
  filename: 'bundle.js',
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
  devtool: 'source-map',
  output: output,
  target: 'electron-renderer',
  resolve: {
    extensions: [ '.ts', '.tsx', '.js'],
    mainFields: ['main']
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: defaultInclude
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use:'css-loader!sass-loader'
        }),
        include: defaultInclude
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader?name=img/[name]__[hash:base64:5].[ext]'
        ],
        include: defaultInclude
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: [':data-src']
          }
        },
        include: defaultInclude
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader?name=font/[name]__[hash:base64:5].[ext]'
        ],
        include: defaultInclude
      },
      {
        test:/\.json$/,
        use: [
          'json-loader'
        ],
        include: defaultInclude
      }

    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js',
      minChunks: Infinity
    }),
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new ExtractTextPlugin({
      filename: 'styles.css',
      disable: !isProduction
    })
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     'DEBUG': JSON.stringify(process.env.DEBUG)
    //   }
    // })
  ]
};

console.log(require('util').inspect(module.exports, {colors: true}))
