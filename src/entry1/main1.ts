import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'

Vue.use(VueRouter)
Vue.use(ElementUI)

let router = new VueRouter({
    routes: [
        {
            path: "/button",
            component: require("@/comps/button.vue").default
        },
        {
            path: "/input",
            component: require("@/comps/input.vue").default
        }
    ]
})

new Vue({
    el: '#app',
    render: h => h(App),
    router
})
