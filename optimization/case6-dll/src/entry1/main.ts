import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import 'element-ui/lib/theme-chalk/index.css'
import '@/comps/index'

Vue.use(VueRouter)

let router = new VueRouter({
    routes: [
        {
            path: "/button",
            component: () => import("@/comps/button.vue")
        },
        {
            path: "/input",
            component: () => import("@/comps/input.vue")
        }
    ]
})

new Vue({
    el: '#app',
    render: h => h(App),
    router
})