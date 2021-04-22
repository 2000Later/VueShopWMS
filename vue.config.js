module.exports = {
  chainWebpack: config => {
    // 发布模式
    // config.when(获取当前编译模式,回调函数) 判断处于什么模式
    config.when(process.env.NODE_ENV === 'production', config => {
      // 进入默认打包路口(main.js),先清空默认路口，在追加自己的打包路口
      config.entry('app').clear().add('./src/main-prod.js')
      // 设置外部引入的插件，为项目依赖
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
      // 通过config找到html插件，通过链式操作(.tap)形成回调函数，修改插件中的参数
      config.plugin('html').tap(args => {
        // 生产环境的标识
        args[0].isProd = true
        return args
      })
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}
