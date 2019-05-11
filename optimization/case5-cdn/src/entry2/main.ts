import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import '@/comps/elemeRegister'
import {join} from 'lodash-es';
import add from 'lodash-es/add';


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
console.log(join)
console.log(join(["Hello","lodash"]," "))
console.log(add(1,2));