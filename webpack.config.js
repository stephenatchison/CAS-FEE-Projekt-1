const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('./styles/noteApp.css');

module.exports = {
  entry: './app/app.js',
  output: {
    filename: './scripts/noteApp.[hash].js',
    path: path.resolve(__dirname, 'static')
  },
  module: {
    rules: [{
      test: /.jsx?$/,
      include: [
        path.resolve(__dirname, 'app')
      ],
      exclude: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, 'bower_components')
      ],
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    },
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: {
          loader: 'css-loader',
          options: {
            sourceMap: false
          }
        },
        publicPath: '/ui'
      })
    }]
  },
  devtool: 'source-map',
  plugins: [
    new ExtractTextPlugin({
      filename: 'styles/noteApp.css'
    }),
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './app/index.template.html',
      inject: true
    })
  ]
};