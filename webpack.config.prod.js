'use strict';
const path = require('path');
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  cache: true,
  watch: true,
  devtool: 'source-map',
  context: path.join(__dirname, "/src"),
  entry: {
    main: "./main",
    vendors: [
      'angular2/bundles/angular2-polyfills.js',
      'angular2/platform/browser',
      'angular2/core',
      'angular2/http',
      'angular2/router',
      'rxjs/Rx',
      'material-design-lite/material.min.js',
      'lodash',
      'moment',
      'accounting'
    ]
  },
  output: {
    path: path.join(__dirname, '/public'),
    publicPath: "/",
    filename: "[name].[chunkhash].js"
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css')
      },
      {
        test: /\.(scss|sass)$/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap!postcss-loader!resolve-url!sass?sourceMap')
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        loader: 'url?name=imgs/[name].[hash:20].[ext]&limit=100000'
      },
      {
        test: /\.(svg|ttf|eot|woff|woff2)$/,
        loader: 'file?name=fonts/[name].[hash:20].[ext]',
        exclude: /\/src\/imgs\//
      },
      {
        test: /\.json$/,
        loader: 'json?name=data/[name].[hash:20].[ext]'
      },
      {
        test: /index\.html$/,
        loader: 'html'
      },
      {
        test: /\.html$/,
        loader: 'raw',
        exclude: path.join(__dirname, "src/index.html")
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      filename: 'vendors.[chunkhash].js',
      minChunks: 2
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      "window.jQuery": 'jquery'
    }),
    new ExtractTextPlugin("[name].[chunkhash].css", {
      disable: false,
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body',
      favicon: 'favicon.ico',
      chunksSortMode: 'none'
    }),
    new AssetsPlugin({
      filename: 'assets.json',
      path: path.join(__dirname, 'public/')
    }),
    new CopyWebpackPlugin([
      {from: 'error.html'}
    ]),
    new CleanWebpackPlugin(['./public'])
  ],
  postcss: function () {
    return {
      defaults: [autoprefixer({browsers: ['last 2 versions']})]
    };
  }
};