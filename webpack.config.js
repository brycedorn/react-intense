const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const devMode = process.env.NODE_ENV === 'development';
const publicPath = devMode ? '/' : 'https://brycedorn.gitlab.io/react-intense';

module.exports = {
  entry: './src/index.js',
  mode: process.env.NODE_ENV,
  output: {
    path: `${__dirname}/public`,
    publicPath,
    filename: devMode ? 'bundle.js' : '[name].[hash].js',
  },
  optimization: devMode ? {} : {
    minimizer: [new UglifyJsPlugin({
      cache: true,
      parallel: true,
      extractComments: 'all',
    })],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.jpg$/,
        use: ["file-loader"]
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      publicPath: `"${publicPath}"`,
    }),
    new HtmlWebpackPlugin({
      title: 'The Movie Mashup Game',
      description:
        'From a plot synopsis combining the plots of two movies that share an overlapping word in the title, determine the mashed-up title of the hybrid.',
      image: 'https://www.movie-mashup.com/image.jpg',
      url: 'https://movie-mashup.com/',
      template: 'src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
    new ProgressBarPlugin()
  ]
};