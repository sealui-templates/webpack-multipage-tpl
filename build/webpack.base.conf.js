const path                  = require('path');
const os                    = require('os');
const webpack               = require('webpack');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CopyWebpackPlugin     = require('copy-webpack-plugin')
const HappyPack             = require('happypack');
const happyThreadPool       = HappyPack.ThreadPool({ size: os.cpus().length });
const utils                 = require('./utils')
const config                = require('./config')
const pkg                   = require('../package.json');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const banner =
  ` ${pkg.name}  V${pkg.version}
 file      :  [filebase]
 Update    :  ${new Date().toISOString().slice(0, 10)}
 Author    :  ${pkg.author}
 Copyright :  ${+new Date().getFullYear()} SealUI`;

const allSource = [resolve('src'), resolve('public')]

module.exports = {
  context: path.resolve(__dirname, '../'),
  devtool: process.env.NODE_ENV === 'production' ? 'none' : 'cheap-eval-source-map',
  //entry: Object.assign(utils.entries(),{entry:'./src/entry.js'}),
  entry : utils.entries(),
  output: {
    filename      : '[name].js',
    chunkFilename : '[name].js',
  },
  resolve:{
    alias :{
      "@"      : resolve('/src'),
      "views"  : resolve('/src/pages'),
      "public" : resolve('/public'),
      "res"    : resolve('/src/static'),
    },
    extensions: [".js", ".json",".styl",".css"]
  },
  module: {
    // 编译规则
    rules: [
      // {
      //   test: /\.js$/,
      //   use: ['babel-loader'],
      //   include: allSource,
      //   exclude: /node_modules/
      // },
      {
          test: /\.jsx?$/,
          use: 'happypack/loader?id=jsx',
          include: allSource,
          exclude: /node_modules/
      },
      // {
      //   test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      //   use: [{
      //     loader: 'url-loader',
      //     options: {
      //       limit: 10000,
      //       name: utils.assetsPath('img/[name].[hash:7].[ext]')
      //     }
      //   }],
      //   include:allSource,
      //   exclude:/node_modules/
      // },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        include:allSource,
        exclude:/node_modules/,
        use: [
          'file-loader?limit=11000&hash=sha512&digest=hex&name='+utils.assetsPath("img/[hash:12].[ext]"),
          'image-webpack-loader',
          // {
          //   loader: 'image-webpack-loader',
          //   options: {
          //     mozjpeg: {
          //       progressive: true,
          //       quality: 65
          //     },
          //     // optipng.enabled: false will disable optipng
          //     optipng: {
          //       enabled: true,
          //     },
          //     pngquant: {
          //       quality: '75-90',
          //       speed: 3
          //     },
          //     gifsicle: {
          //       interlaced: false,
          //     },
          //     // the webp option will enable WEBP
          //     webp: {
          //       quality: 75
          //     }
          //   }
          // },
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        include:allSource,
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test:/\.tpl$/,
        loader:'html-loader',
        options: {
           minimize: false,
           removeComments: true,
           collapseWhitespace: true
         }
      },

    ]
  },

  // 插件
  plugins: [
    new HappyPack({  // HappyPack插件
      id: 'jsx',
      loaders: ['babel-loader?cacheDirectory=true'],
      threadPool: happyThreadPool
    }),
    new FaviconsWebpackPlugin({
      logo            : './public/icons/carrot.png',
      prefix          : process.env.NODE_ENV === 'production' ? config.build.assetsSubDirectory+'/icons/' : config.dev.assetsSubDirectory+'/icons/',
      emitStats       : false,
      statsFilename   : 'iconstats-[hash].json',
      persistentCache : true,
      inject          : true,
      background      : '#fff',
      title           : 'Webpack App',
      icons           : {
        android      : false,
        appleIcon    : false,
        appleStartup : false,
        coast        : false,
        favicons     : true,
        firefox      : false,
        opengraph    : false,
        twitter      : false,
        yandex       : false,
        windows      : false
      }
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../public'),
        to: process.env.NODE_ENV === 'production' ? config.build.assetsSubDirectory : config.dev.assetsSubDirectory,
        ignore: ['.*','*.styl']
      }
    ]),
    //版本信息
    new webpack.BannerPlugin({
      banner: banner,
      raw: false,
      entryOnly: true,
      //include: /\.js/g,
    }),
  ]
};

