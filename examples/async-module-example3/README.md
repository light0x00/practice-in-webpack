
# 动态导入配置项

## lazy&lazy

entry1

```js
import (/* webpackChunkName: "asyncA",webpackMode:"lazy"*/'lodash')
```

entry2

```js
import (/* webpackChunkName: "asyncA",webpackMode:"lazy"*/'lodash')
```

打包结果:

```txt
                   Asset       Size          Chunks             Chunk Names
        entry1.bundle.js   8.53 KiB          entry1  [emitted]  entry1
        entry2.bundle.js   8.75 KiB          entry2  [emitted]  entry2
vendors~asyncA.bundle.js    547 KiB  vendors~asyncA  [emitted]  vendors~asyncA
```

## eager&lazy

entry1

```js
import (/* webpackChunkName: "asyncA",webpackMode:"eager"*/'lodash')
```

entry2

```js
import (/* webpackChunkName: "asyncA",webpackMode:"lazy"*/'lodash')
```

打包结果:

```txt
                   Asset       Size          Chunks             Chunk Names
        entry1.bundle.js    551 KiB          entry1  [emitted]  entry1
        entry2.bundle.js   8.76 KiB          entry2  [emitted]  entry2
vendors~asyncA.bundle.js    547 KiB  vendors~asyncA  [emitted]  vendors~asyncA
```

## weak

entry1

```js
// import (/* webpackChunkName: "asyncA",webpackMode:"lazy"*/'lodash')
```

entry2

```js
setTimeout(
    ()=>{
        import (/* webpackChunkName: "asyncA",webpackMode:"weak"*/'lodash')
    },5000
)
```

打包结果

```txt
           Asset       Size  Chunks             Chunk Names
entry1.bundle.js   4.06 KiB  entry1  [emitted]  entry1
entry2.bundle.js   4.57 KiB  entry2  [emitted]  entry2
```

将这两个entry引入同一个html页面,浏览器中运行会抛出如下异常

```txt
Uncaught (in promise) Error: Module './node_modules/lodash/lodash.js' is not available (weak dependency)
```

