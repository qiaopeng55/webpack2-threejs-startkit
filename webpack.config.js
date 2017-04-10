// const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
  entry: './app.js',
  output: {
    filename: 'bundle.js',
    path: __dirname,
  },
  plugins: [new HtmlWebpackPlugin()],
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
        exclude: /(node_modules|bower_components|\.spec\.js)/,
        // options: {
        //   // https://github.com/babel/babel-loader#options
        //   cacheDirectory: isDebug,
        // }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
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
        loader: 'css-loader!sass-loader',
        exclude: /(node_modules|bower_components|\.spec\.js)/,
      },
      // {
      //   test: /\.html$/,
      //   loader: 'html-loader',
      //   exclude: /(node_modules|bower_components|\.spec\.js)/,
      // },
    ],
  },
 // resolve: {
 //     modules: [path.resolve(__dirname, "src"), "node_modules"]
 // },
};
