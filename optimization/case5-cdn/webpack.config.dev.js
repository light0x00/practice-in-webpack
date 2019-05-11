const merge = require('webpack-merge');
const { join: _join, resolve: _resolve } = require('path');
const common = require('./webpack.config.js');

var config = merge(common, {
  mode: 'development',
  devtool: false,
  /* 不包含哪些包到bundle中 并为这些排除的包指定全局变量名(这些变量在最终运行的环境中应该存在 否则undefined)  
   以下两种场景会比较有用
   1. 库开发者
   2. 要用cdn全局引入包
  */
  externals: {
    /* 
      key: 决定导入名称,e.g import "xx"
      value: 全局变量的名称
  */
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'lodash-es': '_',
  }
})
module.exports = config
