const path = require('path');
const webpack = require('webpack');
const chalk = require('chalk');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const output = './dist';

module.exports = {
  entry: {
    'content': './src/modules/content/content_script.js',
    'inner': './src/modules/content/inner_script.js',
    'background': './src/modules/background/background.js',
    'popup': './src/modules/popup/popup.js',
    'option': './src/modules/option/index.jsx',
  },
  /* devtool: 'cheap-module-source-map', */
  devtool: 'source-map',
  resolve: {
    alias: {
      appRoot: path.join(__dirname, 'src'),
    },
  },
  output: {
    path: path.join(__dirname, output),
    filename: 'js/[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.less/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1
            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true
            }
          }
          
        ]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|wav|mp4)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 2048,
            fallback: 'file-loader',
            // img output path
            name: 'img/[name].[hash:8].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin([ output ]),
    new webpack.ProgressPlugin((percentage, msg, modules) => {
      const stream = process.stderr;
      if (stream.isTTY && percentage < 0.71) {
        stream.cursorTo(0);
        stream.write(chalk.magenta(`  ${(modules || '').split(' ')[0]} ${msg} `));
        stream.clearLine(1);
      }
    }),
    // html output
    new HtmlWebpackPlugin({
      chunks: [ 'option' ],
      filename: 'html/option.html',
      template: './src/modules/option/option.html',
    }), 
    new HtmlWebpackPlugin({
      chunks: [ 'popup' ],
      filename: 'html/popup.html',
      template: './src/modules/popup/popup.html',
    }), 
    // css output path
    //new ExtractTextPlugin('css/[name].css'),
    new CopyWebpackPlugin([
      'src/manifest.json',
      { from: 'src/asset/img/logo.png', to: 'images/logo.png' },
      { from: 'src/modules/content/gremlins.min.js', to: 'js/gremlins.min.js' },
    ]),
    
  ],
};
