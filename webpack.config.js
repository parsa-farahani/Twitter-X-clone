const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const WorkboxPlugin = require('workbox-webpack-plugin');
// const ServiceWorkerWebpackPlugin = 'serviceworker-webpack-plugin';
const { GenerateSW, InjectManifest } = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const glob = require('glob');


module.exports = [
   {
      mode: 'development',
      entry: {
         index: path.resolve(__dirname, 'src/index.js'),
         spa: path.resolve(__dirname, 'src/spa.js'),
         // home: path.resolve(__dirname, 'src/styles/home.scss'),
         // 'user-panel': path.resolve(__dirname, 'src/styles/user-panel.scss'),
      },
      output: {
         path: path.resolve(__dirname, 'dist'),
         filename: '[name][contenthash].js',
         clean: true,
         assetModuleFilename: '[name][ext]',
      },
      devServer: {
         static: {
            directory: path.resolve(__dirname, 'dist')
         },
         port: 3000,
         open: true,
         hot: true,
         compress: true,
         historyApiFallback: true,
         // watchFiles: ['src/**/*.html'],
      },
      module: {
         rules: [
            {
               test: /\.scss$/,
               use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
               test: /\.js$/,
               exclude: /node_modules/,
               use: {
                  loader: 'babel-loader',
                  options: {
                     presets: [
                        '@babel/preset-env',
                     ],
                  },
               }
            },
            {
               test: /\.(png|svg|jpg|jpeg)$/i,
               type: 'assets/images/loaded-resources',
            }
         ]
      },
      plugins: [
         new HTMLWebpackPlugin({
            favicon:'public/favicon.png',
            title: 'Twitter-X',
            filename: 'index.html',
            template: path.resolve(__dirname, 'public/index.html'),
         }),
         // new MiniCssExtractPlugin({
         //    filename: 'styles/[name].css', // Output CSS files to dist/styles
         // }),
         new CopyWebpackPlugin({
            patterns: [
               {
                  from: 'src/pages',
                  to: 'pages',
               },
               {
                  from: 'src/components',
                  to: 'components',
               },
               {
                  from: 'src/assets',
                  to: 'assets',
               },
               {
                  from: 'src/user.json',
                  to: 'user.json',
               },
               {
                  from: 'src/tweets.json',
                  to: 'tweets.json',
               },
               {
                  from: 'src/comments.json',
                  to: 'comments.json',
               },
               {
                  from: 'public/manifest.webmanifest',
                  to: 'manifest.webmanifest',
               }
            ]
         }),
         new InjectManifest({
            swSrc: './src/sw.js',
            swDest: 'sw.js',
         }),
      ]
   },
]