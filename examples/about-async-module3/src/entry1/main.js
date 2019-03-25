setTimeout(
    ()=>{
        import (/* webpackChunkName: "asyncA",webpackMode:"lazy",Preloading:true */'../common/async1')
    },10000
)




/* 
webpackChunkName
webpackMode
    lazy    延迟加载,默认值
    eager   将该模块与当前entry打包到同一个chunk里(这意味着,对于当前entry而言 webpackChunkName将无效).   如果该模块还被其他entry动态导入,则还会为其他entry打一个单独的chunk
    weak  

// 4.6.0+ 
webpackPrefetch     
    关于prefetch https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Link_prefetching_FAQ
Preloading      // 4.6.0+ 
*/