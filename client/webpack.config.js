"use strict";

var Path = require("path"),
    webpack = require("webpack"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
    DefinePlugin = require('webpack/lib/DefinePlugin'),
    IS_PRODUCTION = false;

var webpackConfig = module.exports = {
  entry: "./client/scripts/index.js",
  output: {
    path: Path.resolve(__dirname, "../public/assets"),
    publicPath: "assets/",
    filename: (IS_PRODUCTION ? "[hash].js" : "bundle.js")
  },
  module: {
    loaders: [
      { test: /\.js(x?)$/, loaders: ["jsx-loader?harmony", "babel-loader?stage=0"]},
      { test: /\.jpg$/, loader: "file-loader" },
      { test: /\.css$/, loader: "style-loader!css-loader?root=../" },
      { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader'},
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./client/index.html",
      filename: "../index.html"
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(IS_PRODUCTION ? 'production' : 'development')
    }),
    new UglifyJSPlugin()
  ]
};