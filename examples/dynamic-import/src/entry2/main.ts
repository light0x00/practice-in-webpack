
setTimeout(
    async ()=>{
        let _ = await import (/* webpackChunkName: "asyncA",webpackMode:"lazy",webpackPreload:true*/'lodash')
        let s =_.join(["dynamic","import","in","ts"])
        console.log(s)
    },5000
)
