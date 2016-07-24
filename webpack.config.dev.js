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
  devtool: 'cheap-module-source-map',
  context: path.join(__dirname, "/src"),
  entry: {
    main: "./main",
    vendors: [
      'core-js/es6',
      'reflect-metadata',
      'zone.js/dist/zone',
      '@angular/platform-browser',
      '@angular/platform-browser-dynamic', '@angular2/core',
      '@angular2/common',
      '@angular2/compiler',
      '@angular/forms',
      '@angular2/http',
      '@angular2/router',
      'rxjs/Rx',
      'material-design-lite/material.min.js',
      'lodash',
      'moment',
      'accounting',
      'toastr'
    ]
  },
  output: {
    path: path.join(__dirname, '/public'),
    publicPath: "/",
    filename: "[name].js"
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
        loader: 'url?name=imgs/[name].[ext]&limit=100000'
      },
      {
        test: /\.(svg|ttf|eot|woff|woff2)$/,
        loader: 'file?name=fonts/[name].[ext]',
        exclude: /\/src\/imgs\//
      },
      {
        test: /\.json$/,
        loader: 'json?name=data/[name].[ext]'
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
      filename: 'vendors.js',
      minChunks: Infinity
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    new ExtractTextPlugin("[name].css", {
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
}
;