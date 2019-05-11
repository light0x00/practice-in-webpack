import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
Vue.component('el-button', () => import(/* webpackPrefetch:true */'element-ui/packages/button/index.js'))
Vue.component('el-radio', () => import(/* webpackPrefetch:true */'element-ui/packages/radio/index.js'))
Vue.component('el-input', () => import(/* webpackPrefetch:true */'element-ui/packages/input/index.js'))