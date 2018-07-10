const path = require('path')
const webpack = require('webpack')
const config = require('./config')
const utils = require('./utils')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
//var ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ManifestPlugin = require('webpack-manifest-plugin');


var notifier = require('node-notifier');

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: 'none',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  output: {
    publicPath    : config.build.assetsPublicPath,
    path          : config.build.assetsRoot,
    filename      : utils.assetsPath('js/[hash:11][id].js'),
    chunkFilename : utils.assetsPath('js/[chunkhash:12].js'),
    libraryTarget : 'umd',
    library       : 'Seal',
    umdNamedDefine    : true,
  },
  externals : {

  },
  // 提取公共代码
  optimization: {
    minimizer:[
      new UglifyjsWebpackPlugin({
        parallel: true,
        //使用缓存
        cache: true,
        uglifyOptions: {
          compress: {
            warnings: false,
            drop_console: true,
            arrows: false,
            collapse_vars: false, // 0.3kb
            comparisons: false,
            computed_props: false,
            hoist_funs: false,
            hoist_props: false,
            hoist_vars: false,
            inline: false,
            loops: false,
            negate_iife: false,
            properties: false,
            reduce_funcs: false,
            reduce_vars: false,
            switches: false,
            toplevel: false,
            typeofs: false,

            // a few flags with noticable gains/speed ratio
            // numbers based on out of the box vendor bundle
            booleans: true, // 0.7kb
            if_return: true, // 0.4kb
            sequences: true, // 0.7kb
            unused: true, // 2.3kb

            // required features to drop conditional branches
            conditionals: true,
            dead_code: true,
            evaluate: true
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            ascii_only: true,
            comments: /^\**!|@preserve|@license|@cc_on/
          },
        }
      }),
    ],
    splitChunks: {
      //chunks: 'initial',
      //chunks:'all',
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        },
        vendors: {
          test: /[\\\/]node_modules[\\\/]/,
          name: 'vendor',
          chunks: 'initial',
          priority: -10,
          enforce: true
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    //new BundleAnalyzerPlugin(),
    new UglifyjsWebpackPlugin(),
    //new webpack.HotModuleReplacementPlugin(),
    //new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin({
      onErrors: (severity, errors) => {
        if (severity !== 'error') {
          return;
        }
        const error = errors[0];
        notifier.notify({
          title: "Webpack error",
          message: severity + ': ' + error.name,
          subtitle: error.file || '',
          icon: path.join(__dirname, 'icon.png')
        });
      }
    }),
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[contenthash:11][id].css'),
      chunkFilename: utils.assetsPath('css/[name].[contenthash:8].chunk.css'),
      //allChunks:true
    }),
    // new ExtractTextPlugin({
    //   filename: utils.assetsPath('css/[hash:11][id].css'),
    //   allChunks:true
    // }),
    new OptimizeCSSPlugin({
      canPrint: false,
      cssProcessorOptions: {
        safe: true,
        autoprefixer: {
          disable: true
        },
        mergeLonghand: false
      }
    }),
    new ManifestPlugin({
      fileName: 'asset-manifest.json'
    }),
  ].concat(utils.htmlEntries())
})

if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}



module.exports = webpackConfig;
