import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import 'element-ui/lib/theme-chalk/index.css'
import '@/comps/elemeRegister'
import * as _ from 'lodash';

Vue.use(VueRouter)

let router = new VueRouter({
    routes: [
        {
            path: "/button",
            component: () => import("@/comps/button.vue")
        },
        {
            path: "/radio",
            component: () => import("@/comps/radio.vue")
        }
    ]
})

new Vue({
    el: '#app',
    render: h => h(App),
    router
})

console.log(_.join(["Hello","lodash"]," "))