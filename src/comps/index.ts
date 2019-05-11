import Vue from 'vue'
//https://webpack.js.org/guides/tree-shaking/   https://webpack.docschina.org/configuration/optimization/#optimization-providedexports
//https://webpack.docschina.org/plugins/split-chunks-plugin/
//https://webpack.js.org/api/module-methods/#import
//https://github.com/ElemeFE/element/blob/master/components.json
//https://cn.vuejs.org/v2/guide/components-dynamic-async.html#ad
Vue.component('el-button',() => import('element-ui/packages/button/index.js'))
Vue.component('el-radio',() => import('element-ui/packages/radio/index.js'))
Vue.component('el-input',() => import('element-ui/packages/input/index.js'))