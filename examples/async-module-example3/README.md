
# 动态导入模块的配置项

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

## lazy-once

导入不确定的module的场景,比如我们要支持国际化,有一个存放了各种语言的目录:

```txt
-language
    |-us.json
    |-zh.json
```

然后我们会在运行时去获取当前浏览器设置的语言

```js
let lang= (navigator.language||navigator.userLanguage).substring(3,5).toLowerCase();
```

得到了方言,你可能会打算向下面这样导入

```js
import(`../language/${lang}.json`)
```

我们看下这样导入的打包结果

```txt
           Asset       Size  Chunks             Chunk Names
     0.bundle.js  548 bytes       0  [emitted]  
     1.bundle.js  542 bytes       1  [emitted]  
entry1.bundle.js   11.5 KiB  entry1  [emitted]  entry1
```

上面的`0.bundle.js`、`1.bundle.js`分别对应`zh.json` `us.json`. 你会发现 `language`目录下的每一个文件都分别打包了一个chunk. 

我们希望这它们都被打成一个chunk,你可能会尝试用`webpackChunkName`

```js
import(/* webpackChunkName:"lang" */`../language/${lang}.json`).then(
    (mo)=>{
        console.log(mo)  
    }
)
```

我看下打包结果:

```js
entry1.bundle.js   11.7 KiB  entry1  [emitted]  entry1
 lang0.bundle.js  554 bytes   lang0  [emitted]  lang0
 lang1.bundle.js  548 bytes   lang1  [emitted]  lang1
```

language目下的module依旧被打包成了多个chunk.


### 正确的做法

那么现在可以让主角`lazy-once`上场了

```js
import(/* webpackMode:"lazy-once" */`../language/${lang}.json`)
```

再看一下打包结果

```txt
           Asset        Size  Chunks             Chunk Names
     0.bundle.js  1020 bytes       0  [emitted]  
entry1.bundle.js    11.8 KiB  entry1  [emitted]  entry1
```

可以看到,language目下的module终于合到一个chunk里了.
