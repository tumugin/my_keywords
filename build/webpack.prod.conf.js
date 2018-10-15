'use strict'

const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.conf.js')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    path: resolve('prod')
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.css?$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader?modules',
          'postcss-loader'
        ]
      },
      {
        test: /\.styl(us)?$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader?modules',
          'postcss-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader?modules',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash].css'
    })
  ]
})
