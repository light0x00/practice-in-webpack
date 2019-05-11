// let a = import (/* webpackChunkName: "asyncA",webpackMode:"lazy"*/'lodash')

// setTimeout(
//     ()=>{
//         // let r = import (/* webpackChunkName: "asyncA",webpackMode:"lazy",webpackPrefetch:true*/'lodash')
//         let r = import (/* webpackChunkName: "asyncA",webpackMode:"lazy",webpackPreload:true*/'lodash')
//         console.log(r)
//     },5000
// )

let lang= (navigator.language||navigator.userLanguage).substring(3,5).toLowerCase();
// console.log(lang)  //输出: us

// import(/* webpackMode:"lazy-once" */`../language/${lang}.json`).then(
//     (mo)=>{
//         console.log(mo)  //输出: {msg: "Hello,World"}
//         lang="zh"
//         import(/* webpackMode:"lazy-once" */`../language/${lang}.json`).then(
//             (mo)=>{
//                 console.log(mo)  //输出: {msg: "Hello,World"}
//             }
//         )
//     }
// )


// import(`../language/us.json`).then(
//     (mo)=>{
//         console.log(mo)  //输出: {msg: "Hello,World"}

//         import(`../language/us.json`).then(
//             (mo)=>{
//                 console.log(mo)  //输出: {msg: "Hello,World"}
//             }
//         )
//     }
// )

// import(`../language/${lang}.json`).then(
//     (mo)=>{
//         console.log(mo)  //输出: {msg: "Hello,World"}

//         import(`../language/${lang}.json`).then(
//             (mo)=>{
//                 console.log(mo)  //输出: {msg: "Hello,World"}
//             }
//         )
//     }
// )

import(/* webpackMode:"lazy-once" */`../language/${lang}.json`).then(
    (mo)=>{
        console.log(mo)  //输出: {msg: "Hello,World"}
    }
)


// import(/* webpackChunkName:"lang" */`../language/${lang}.json`).then(
//     (mo)=>{
//         console.log(mo)  //输出: {msg: "Hello,World"}
//     }
// )

