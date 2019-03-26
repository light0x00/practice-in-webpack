let a = import (/* webpackChunkName: "asyncA",webpackMode:"lazy"*/'lodash')

setTimeout(
    ()=>{
        // let r = import (/* webpackChunkName: "asyncA",webpackMode:"lazy",webpackPrefetch:true*/'lodash')
        let r = import (/* webpackChunkName: "asyncA",webpackMode:"lazy",webpackPreload:true*/'lodash')
        console.log(r)
    },5000
)