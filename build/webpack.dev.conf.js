const path                 = require('path')
const webpack              = require('webpack')
const config               = require('./config')
const utils                = require('./utils')
const merge                = require('webpack-merge')
const baseWebpackConfig    = require('./webpack.base.conf')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const chalk                = require('chalk')
const portfinder           = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)


const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  output: {
    path          : config.dev.assetsRoot,
    publicPath    : config.dev.assetsPublicPath,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ].concat(utils.htmlEntries()),
  // 开发服务器配置
  devServer: {
    clientLogLevel     : 'warning',
    historyApiFallback : true,
    quiet              : true,
    compress           : true,
    //noInfo           : true,
    inline             : true,//打包后加入一个websocket客户端
    hot                : true,//热加载
    contentBase        : path.resolve(__dirname, '../dist'),  //启动路径
    host               : HOST || config.dev.host,
    port               : PORT || config.dev.port,
    open               : config.dev.autoOpenBrowser || false,
    proxy              : config.dev.proxyTable,
    overlay            : config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    watchOptions       : {
      poll: config.dev.poll,
    }
  }
})



module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      process.env.PORT = port
      let host = HOST || config.dev.host
      devWebpackConfig.devServer.port = port
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [chalk.green(utils.createCompiledSuccessCallback(host,process.env.PORT))],
      },
      onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
    })
      )
      resolve(devWebpackConfig)
    }
  })
})
//module.exports = webpackConfig;
