// const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { resolve } = require('path');
const webpack = require('webpack');

// check if HMR is enabled
if (module.hot) {
    // accept itself
  module.hot.accept();
}


module.exports = {
  context: resolve(__dirname, 'src'),

  entry: [
    'react-hot-loader/patch',
    // activate HMR for React

    'webpack-dev-server/client?http://localhost:8080',
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint

    'webpack/hot/only-dev-server',
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates

    // './app.js',
    './index.js',
    // the entry point of our app
  ],
  output: {
    filename: 'bundle.js',
		// the output bundle

    path: resolve(__dirname, 'dist'),

    publicPath: '/',
		// necessary for HMR to know where to load the hot update chunks
  },

  devtool: 'inline-source-map',

  devServer: {
    hot: true,
    // enable HMR on the server

    contentBase: resolve(__dirname, 'dist'),
    // match the output path

    publicPath: '/',
    // match the output `publicPath`
  },


  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: /(node_modules|bower_components|\.spec\.js)/,
        use: [
          {
            loader: 'eslint-loader',
            options: {
              failOnWarning: false,
              failOnError: false,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        // include: [
        //   path.resolve(__dirname),
        // ],
        exclude: /(node_modules|bower_components|\.spec\.js)/,
        // options: {
        //   // https://github.com/babel/babel-loader#options
        //   cacheDirectory: isDebug,
        // }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
              sourceMap: true,
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: 'inline',
            },
          },
        ],
        exclude: /(node_modules|bower_components|\.spec\.js)/,
      },
      {
        test: /\.png$/,
        loader: 'url-loader?limit=100000',
        exclude: /(node_modules|bower_components|\.spec\.js)/,
      },
      {
        test: /\.jpg$/,
        loader: 'file-loader',
        exclude: /(node_modules|bower_components|\.spec\.js)/,
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
        exclude: /(node_modules|bower_components|\.spec\.js)/,
      },
      // {
      //   test: /\.html$/,
      //   loader: 'html-loader',
      //   exclude: /(node_modules|bower_components|\.spec\.js)/,
      // },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
		// enable HMR globally

    new webpack.NamedModulesPlugin(),
		// prints more readable module names in the browser console on HMR updates

    new HtmlWebpackPlugin({
      title: 'Custom template',
      template: 'template.html',
    })],
};
