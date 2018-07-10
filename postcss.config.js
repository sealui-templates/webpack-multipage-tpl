module.exports = {
  plugins: [
    require('autoprefixer')({
      browsers: require('./package.json').browserslist
    }),
    //require('autoprefixer')(),
    require('postcss-flexbugs-fixes')(),
    require('postcss-calc')()
  ]
}
