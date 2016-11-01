"use strict";
var Path = require("path"),
    webpack = require("webpack"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    webpackConfig,

    IS_PRODUCTION = "production" === process.env.NODE_ENV,
    JSX_WITH_HOT_LOADERS = ["react-hot-loader", "jsx-loader?harmony", "babel-loader?stage=0"],
    CSS_LOADER = "style-loader!css-loader?root=../",

webpackConfig = module.exports = {
  entry: "./client/scripts/index.js",
  output: {
    path: Path.resolve(__dirname, "../public/assets"),
    publicPath: "assets/",
    filename: (IS_PRODUCTION ? "[hash].js" : "bundle.js")
  },
  module: {
    loaders: [
      { test: /\.js(x?)$/, loaders: JSX_WITH_HOT_LOADERS },
      { test: /\.jpg$/, loader: "file-loader" },
      { test: /\.css$/, loader: CSS_LOADER },
      { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader'},
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./client/index.html",
      filename: "../index.html"
    })
  ]
};

if (IS_PRODUCTION) {
  webpackConfig.plugins.push(
    new webpack.optimize.DedupePlugin()
  );
}
