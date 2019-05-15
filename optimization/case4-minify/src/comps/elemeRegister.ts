import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
Vue.component('el-button', () => import(/* webpackPrefetch:true */'element-ui/lib/button'))
Vue.component('el-radio', () => import(/* webpackPrefetch:true */'element-ui/lib/radio'))
Vue.component('el-input', () => import(/* webpackPrefetch:true */'element-ui/lib/input'))