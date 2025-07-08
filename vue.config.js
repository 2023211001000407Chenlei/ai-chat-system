module.exports = {
  chainWebpack: config => {
    config.module
      .rule('js')
      .test(/\.js$/)
      .exclude
        .add(/node_modules/)
        .end()
      .use('babel-loader')
        .loader('babel-loader')
        .options({
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-runtime'],
          cacheDirectory: true // 启用缓存，提高编译速度
        })
        .end();
  }
};