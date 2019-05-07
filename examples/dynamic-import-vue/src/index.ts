
import * as _ from 'lodash'
import Vue from 'vue'

import VueRouter from 'vue-router'

Vue.use(VueRouter)

let router = new VueRouter({
    routes: [
        {
            path: "/foo",
            component: () => import("./module.vue")
            // component: require("./module.vue").default
        }
    ]
})


let vm = new Vue({
    el: "#app",
    router,
    render(h) {
        return h(
            "div", {/* html属性 */attrs: { id: "app" } },
            /* 子级虚拟节点 */
            [
                h('router-link', { props: { to: "/foo" } },"测试"),
                h('router-view'),

            ]
        )
    }
})


