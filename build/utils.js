const path              = require('path')
const config            = require('./config')
// var ExtractTextPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const postcssConfig     = require('../postcss.config.js')
const glob              = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const PAGE_PATH         = path.resolve(__dirname, '../src/pages')
const merge             = require('webpack-merge')
const packageConfig = require('../package.json')

// 静态路径
exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

// css加载器
exports.cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }
  var postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap,
      plugins: () => postcssConfig.plugins
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    var loaders = [cssLoader, postcssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      // return ExtractTextPlugin.extract({
      //   use: loaders,
      //   fallback: 'style-loader'
      // })
      return [{
        loader:MiniCssExtractPlugin.loader
      }].concat(loaders)
    } else {
      return ['style-loader'].concat(loaders)
    }
  }

  var stylusOptions = {
    'resolve url': true
  }
  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', {indentedSyntax: true}),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus', stylusOptions),
    styl: generateLoaders('stylus', stylusOptions)
  }
}

// 样式加载器
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      oneOf: [{
        use: loader
      }]
    })
  }
  return output
}

// 错误提示
exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return
    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()
    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'icon.png')
    })
  }
}

// 编译成功提示
exports.createCompiledSuccessCallback = (host,port) =>{
  return `
  ┌────────────────────────── 👙 ───────────────────────────┐
  │ ✔ IP地址：    http://${host}:${port}                 │
  │ ✔ LOCAL地址： http://localhost:${port}                     │
  └─────────────────────────────────────────────────────────┘
        `;
}

/**
 * 导出入口
 *
 * @Author 听着情歌流泪
 * @Date   2018-07-08
 * @return {[type]}   [description]
 */
exports.entries = function () {
  var entryFiles = glob.sync(PAGE_PATH + '/**/*.js')
  var map = {}
  entryFiles.forEach((filePath) => {
      var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
      map[filename] = filePath
  })
  return map
}

//多页面输出配置
// 与上面的多页面入口配置相同，读取pages文件夹下的对应的html后缀文件，然后放入数组中
exports.htmlEntries = function () {
  let entryTpl = glob.sync(PAGE_PATH + '/**/*.html')
  let tplArr = []
  entryTpl.forEach((filePath) => {
      let fileName = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
      let conf = {
        title       :fileName,
        // 模板来源
        template    :filePath,
        // 文件名称
        filename : fileName+'.html',
        //filename : process.env.NODE_ENV === 'production' ? 'views/'+fileName+'.ejs' : fileName+'.html',
        // 页面模板需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
        chunks      : ['common', 'vendors',fileName],
        inject      : true,
        hash        : false,
        releaseTime : (new Date()).getTime(),
        links       : [],
      }
      if (process.env.NODE_ENV === 'production') {
        conf = merge(conf, {
          minify: {
            removeAttributeQuotes         : false,
            removeComments                : true,
            collapseWhitespace            : false,
            removeRedundantAttributes     : true,
            useShortDoctype               : true,
            removeEmptyAttributes         : true,
            removeStyleLinkTypeAttributes : true,
            keepClosingSlash              : true,
            minifyJS                      : true,
            minifyCSS                     : true,
            minifyURLs                    : true
          },
          chunksSortMode: 'dependency'
        })
      }
      tplArr.push(new HtmlWebpackPlugin(conf))
  })
  tplArr.push(
    new ScriptExtHtmlWebpackPlugin({
      preload: {
        test: /\.js$/
      }
    })
  )
  return tplArr
}
