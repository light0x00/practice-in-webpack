
import ('lodash')
setTimeout(
    () => import('../common/dynamic1'), 2000
)
setTimeout(
    () => import(
        '../common/dynamic2'), 3000
)

// setTimeout(

//     () => import(
//         '../common/dynamic2'), 4000
// )
