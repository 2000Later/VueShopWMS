// 项目发布阶段需要用到的 babel 插件
const prodPlugins = []
// process.env.NODE_ENV 获取当前的编译模式
if (process.env.NODE_ENV === 'production') {
  // 安装babel-plugin-transform-remove-console插件并使用该插件移除console信息
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 发布产品时候的插件数组
    ...prodPlugins,
    // babel模块化导入插件
    '@babel/plugin-syntax-dynamic-import'
  ]
}
