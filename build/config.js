const path = require('path')
const internalIp = require('internal-ip');

module.exports = {
  build: {
    env                      : 'production',
    //index                    : path.resolve(__dirname, '../dist/index.html'),
    assetsRoot               : path.resolve(__dirname, '../dist'),
    assetsSubDirectory       : 'static',
    assetsPublicPath         : '/', //CDN域名
    productionSourceMap      : false,
    productionGzip           : false,
    productionGzipExtensions : ['js', 'css'],
    bundleAnalyzerReport     : process.env.npm_config_report
  },

  dev: {
    env                : 'development',
    host               : internalIp.v4.sync(),
    port               : 3000,
    autoOpenBrowser    : false,
    assetsSubDirectory : 'static',
    assetsPublicPath   : '/',
    proxyTable         : {},
    cssSourceMap       : false,
    errorOverlay       : true,
    notifyOnErrors     : true,
    poll               : false,
  }
}
