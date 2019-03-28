
# Code Splitting

- [Code Splitting](#code-splitting)
  - [0. 前置约定](#0-%E5%89%8D%E7%BD%AE%E7%BA%A6%E5%AE%9A)
  - [1. what](#1-what)
  - [2. why](#2-why)
  - [3. splitChunks的默认配置](#3-splitchunks%E7%9A%84%E9%BB%98%E8%AE%A4%E9%85%8D%E7%BD%AE)
  - [4. 配置优先级](#4-%E9%85%8D%E7%BD%AE%E4%BC%98%E5%85%88%E7%BA%A7)
  - [5. 同步模块的处理](#5-%E5%90%8C%E6%AD%A5%E6%A8%A1%E5%9D%97%E7%9A%84%E5%A4%84%E7%90%86)
  - [6. 异步模块的处理](#6-%E5%BC%82%E6%AD%A5%E6%A8%A1%E5%9D%97%E7%9A%84%E5%A4%84%E7%90%86)
    - [6.1 动态导入](#61-%E5%8A%A8%E6%80%81%E5%AF%BC%E5%85%A5)
      - [6.1.1 关于webpackMode的lazy-once](#611-%E5%85%B3%E4%BA%8Ewebpackmode%E7%9A%84lazy-once)
        - [正确的做法](#%E6%AD%A3%E7%A1%AE%E7%9A%84%E5%81%9A%E6%B3%95)
  - [7. 相关文档](#7-%E7%9B%B8%E5%85%B3%E6%96%87%E6%A1%A3)
  - [8. 配置分析](#8-%E9%85%8D%E7%BD%AE%E5%88%86%E6%9E%90)

## 0. 前置约定

1. 动态导入的模块称为`异步模块`,普通导入的模块称为`同步模块`,这样称呼是从import返回的是否为Promise的角度来划分的
2. `splitChunks.*`表示 splitChunks下的所有配置项

## 1. what

默认读者已经知道

## 2. why

一个简单的示例 实验一下为什么要 "code splitting"

entry1

```js
import 'lodash'
```

- entry2

```js
import 'lodash'
```

打包结果

```txt
entry1.bundle.js    551 KiB  entry1  [emitted]  entry1
entry2.bundle.js    551 KiB  entry2  [emitted]  entry2
```

可以看到两个chunk都是551 KiB, 显然lodash被分别打包到了这两个chunk中. 这意味者页面中会加载大量重复代码,造成不必要的带宽占用、也不利于浏览器缓存.

## 3. splitChunks的默认配置

```js
splitChunks: {
    chunks: 'async',
    minSize: 30000,
    maxSize: 0, //0 表示没有上限
    minChunks: 2,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
    automaticNameDelimiter: '~',
    name: true,
    cacheGroups: {
        vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
        },
        default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
        }
    }
}
```

上面是webpack的`splitChunks`默认行为, 我们可以知道一个`module`是否应该分拆分成独立的chunk需要具备以下条件:

1. 只对异步(也叫动态导入)的模块所生成的chunk做处理
    > ⚠️ 默认不会对普通导入的模块做任何处理!
2. 新生成的chunk要大于30k
    > 可能官方认为拆出过小的共享chunk,对于体积优化不明显,反而会由于对chunk的请求次数多而增加网络io本身的开销
3. 至少被2个未分割前的chunk共享
    > 被未分割前的chunk(`chunks before spliting`)这是官方文档中屡屡提到的一个词,指你所配置的`entry`
4. 页面加载时 发生的chunk请求数最多3个
    > 这是为了防止拆分的太碎,导致请求数过多),意味着普通导入的模块最多被分为3个
5. 对于动态导入的模块产生的chunk请求不能多于5个
    > 意味着一个entry内,异步请求的模块最多拆分为5份
6. `/node_modules/`中的同步模块(如果满足其他条件)会被打包到 `vendors~*.js`,其他的所有同步模块会被打包到`default~*.js`中

## 4. 配置优先级

好了看到这里,你应该有一个疑问了———

假设设置了maxSize=100k,maxInitialRequest=2,且现在有3个大于100k的共享模块都符合其他所有拆分条件. 这时如果把它们拆为3个chunk就违反了maxInitialRequest,而不拆的话选择把共享模块打包在一起又违反了maxSize

你会发现,webpack的配置是自相矛盾的,但是好在webpack规定了配置优先级:

> Actual priority is maxInitialRequest/maxAsyncRequests < maxSize < minSize.

所以上面的命题的结果是: 会分出3个chunk,因为minSize的优先级最大

除此以外,`cacheGroup`内的配置的优先级也会高于`optimization.splitChunks.*`

## 5. 同步模块的处理

正如本文开头所展示的例子,我们同步导入了的共享模块`lodash`被分别打包到了两个chunk中. 这是因为默认配置只对异步模块产生的chunk做优化.

如果要优化同步模块:

```js
splitChunks:{
    chunks:"all"
}
```

如果希望对同步模块做进一步的控制

```js
cacheGroups: {
    /* 自定义的分割策略 */
    vue: {
        test: /vue/,
        name: "vue",
        enforce: false,
    },
    lodash: {
        test: /[\\/]node_modules[\\/](lodash)[\\/]/,
        name:"lodash"
    }
}
```

以上配置将把vue、lodash单独打包

## 6. 异步模块的处理

默认情况下,**webpack会直接把异步模块分割为一个独立chunk, 即使这个模块不被共享、size只有1bytes**

这意味着异步导入多少个模块,就将打包出多少个chunk.

以下面的entry为例

```js
import ('../common/async1')
import ('../common/async2')
import ('../common/async3')
import ('../common/async4')
import ('../common/async5')
import ('../common/async6')
import ('../common/async7')
```

我们尝试约束**异步模块产生的chunk数量**

```js
splitChunks:{
    maxAsyncRequests: 2
}
```

以上代码的打包结果:

```txt
           Asset       Size  Chunks             Chunk Names
     0.bundle.js  672 bytes       0  [emitted]  
     1.bundle.js  672 bytes       1  [emitted]  
     2.bundle.js  672 bytes       2  [emitted]  
     3.bundle.js  672 bytes       3  [emitted]  
     4.bundle.js  672 bytes       4  [emitted]  
     5.bundle.js  672 bytes       5  [emitted]  
     6.bundle.js  672 bytes       6  [emitted]  
entry1.bundle.js    9.4 KiB  entry1  [emitted]  entry1
```

可以看到每个异步模块都被打包为一个独立的chunk

webpack的设计者也给出了让我们控制 **异步模块分割规则**的方案,在导入时显示的告诉webpack指定**将要导入的异步模块放入哪一个chunk**

```js
import (/* webpackChunkName: "asyncA" */'../common/async1')
import (/* webpackChunkName: "asyncA" */'../common/async2')
import (/* webpackChunkName: "asyncA" */'../common/async3')
import (/* webpackChunkName: "asyncB" */'../common/async4')
import (/* webpackChunkName: "asyncB" */'../common/async5')
import (/* webpackChunkName: "asyncB" */'../common/async6')
```

再次打包的结果如下

```txt
           Asset       Size  Chunks             Chunk Names
asyncA.bundle.js   1.83 KiB  asyncA  [emitted]  asyncA
asyncB.bundle.js   2.42 KiB  asyncB  [emitted]  asyncB
entry1.bundle.js   9.56 KiB  entry1  [emitted]  entry1
```

### 6.1 动态导入

webpack提供的动态导入配置项如下,其中`lazy-once`会在下文中详细讲解,其他配置项的示例可以参考👉[动态导入配置项案例](https://github.com/light0x00/learn-webpack-chunk-spliting/tree/master/examples/async-module-example3)

- webpackChunkName 生成chunk的名称
- webpackMode
  - lazy    延迟加载,默认值
  - eager   始终将该模块与当前entry打包到同一个chunk里(这意味着,对于当前entry而言 webpackChunkName将无效).
          这意味着,如果该模块还被其他entry动态导入,是无法重用的(该模块将同时存在于多个chunk)
  - weak    如果该模块所在的chunk已经被引入了(被浏览器下载过)则重用,否则加载失败并抛出异常
  - lazy-once 下文中会用示例解释这个配置项👉[示例](#5.1.1-lazy-once)

- webpackPrefetch
    设置后浏览器会在空闲时下载这个module所在的chunk,算是一种削峰填谷机制吧
    > 👉[了解浏览器prefetch机制][mdn_prefresh]
- webpackPreloading
    设置后这个异步module所在的chunk会在页面加载时与父chunk并行加载

[mdn_prefresh]:https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Link_prefetching_FAQ

#### 6.1.1 关于webpackMode的lazy-once

用于需要**导入不确定的module的场景**,比如我们要支持国际化,有一个存放了各种语言的目录:

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

我们希望这它们合并为一个chunk,你可能会尝试用`webpackChunkName`

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

##### 正确的做法

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

## 7. 相关文档

[案例源码](https://github.com/light0x00/learn-webpack-chunk-spliting)

[code-splitting](https://webpack.js.org/guides/code-splitting/)

[split-chunk-plugin](https://webpack.js.org/plugins/split-chunks-plugin/)

[module-method](https://www.webpackjs.com/api/module-methods/)

[dynamic-imports](https://webpack.js.org/guides/code-splitting/#dynamic-imports)

## 8. 配置分析

```js
optimization: {
        splitChunks: {
            /*
                将选择哪些块进行优化,有效值为 
                async       只优化异步导入的chunk
                initial     只优化初始chunk (初始块是指 页面加载时就需要的js文件)
                all         it means that chunks can be shared even between async and non-async chunks.
                function    每当要产生一个新的chunk时执行,传入一个将要被分割的chunk对象,返回bool类型将决定是否要分割
            */
            chunks: 'all',
            /* chunk名称连接符,举个例子
                动态导入一个lodash,设置 webpackChunkName为"utils"
                你可能会以为文件名就一定是 utils.xx.js, 实际上是"vendors~utils.xx.js
                因为lodash符合另一个name为vendors的默认cacheGroup,即lodash是在/node_modules/里的
                所以决定chunk最终名称的是 cacheGroupName+webpackChunkName
            */
            automaticNameDelimiter: "~",
            /* 按需加载时并行请求的最大数量。 Maximum number of parallel requests when on-demand loading.*/
            maxAsyncRequests: 5,
            /* 一个entry内同时请求(chunk)最大数量(这将决定一个entry内普通导入的模块的可分割的最大块数)   Maximum number of parallel requests at an entry point. */
            maxInitialRequests: 5,
            /* 一个chunk至少被共享多少次才会被分割 Minimum number of chunks that must share a module before splitting. */
            minChunks: 1,
            /*  */
            /*
                minSize: Minimum size, in bytes, for a chunk to be generated.   默认值30kb
                maxSize: 告诉webpack尝试将size超过此界限的chunk分割为更小的单元(part)  
                1. 弱约束
                maxSize is only a hint and could be violated when modules are bigger than maxSize or splitting would violate minSize.
                这个配置项只是一个参考,可能会由于其他优先级高的配置项而被违反
                1. part 命名
                块已经有一个名称时，每个部分将从该名称派生出一个新名称。 根据 optimization.splitChunks.hidePathInfo 的值，它将添加从第一个模块名派生的密钥或其散列。
                1. 优先级
                maxSize takes higher priority than maxInitialRequest/maxAsyncRequests. Actual priority is maxInitialRequest/maxAsyncRequests < maxSize < minSize.
            */
            // minSize: 30000,
            minSize: 0,
            maxSize: 0,
            /* The name of the split chunk.
                false:  
                true:   will automatically generate a name based on chunks and cache group key. 
                string | function (module, chunks, cacheGroupKey)    
                    提供字符串或函数允许您使用自定义名称。 指定总是返回相同字符串的字符串或函数将把所有common chunk和vendor合并到一个块中。
                    这可能会导致更大的初始下载量和降低页面加载速度。
                ⚠️ 不建议全局设置name属性,
                It is recommended to set splitChunks.name to false for production builds so that it doesn't change names unnecessarily.
            */
            name: false,

            /* Cache groups can inherit and/or override any options from splitChunks.*; 
                1. 配置项
                    缓存组继承/覆盖 splitChunks.*的所有配置, 并新增了3个配置项 test, priority and reuseExistingChunk
                2. 优先级
                    当一个模块属于多个缓存组时, 将选择优先级较高的缓存组。 默认组的优先级为负，以允许自定义组获得更高的优先级(自定义组的默认值为0)。
            */
            cacheGroups: {
                /* 是否禁用默认缓存组 */
                // default: true,
                /* 优先级 */
                // priority,
                /* 默认的分割策略 */
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    /* 值得注意的是
                        将把名称改为
                        假如有 entry1 需要lodash, entry2需要lodash、axios.
                        1. 在没有指定name的情况下, 将生成:
                            vendors~entry1~entry2.js  放lodash
                            vendors~entry2.js   放axios
                        从chunk的去冗余、重用的角度来看,这样是对的.  但是存在一个问题 打包的名称不预知,这意味着 结合HtmlPlugin的时候 我们需要手动添加这些动态生成的chunk.

                        2. 如果指定了name属性,将生成:
                            vendors.js   //lodash和axios
                        这可能就意味着在entry1、entry2分别对应pageA、pageB两个html页面时, 用户访问pageA时会加载的vendors.js里包含了多余的模块(axios)
                    */
                    name: "vendors"
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                    name: "default"
                },
                /* 自定义的分割策略, 以下只是示例 并不代表这样做能优化打包结果 */
                vue: {
                    /* 
                    组策略针对哪些模块(省略该配置项表示匹配所有模块),匹配规则按照绝对模块资源路径、块名称
                            function (module, chunk) | RegExp | string
                      */
                    test: /vue/,
                    name: "vue",
                    /* 重写输出文件名 只对初始块(initial)有效 */
                    // filename:"vue",
                    /* 告诉 webpack 忽略 splitChunks.minSize，splitchunks.minchunk，splitChunks.maxAsyncRequests 和 splitChunks.maxInitialRequests 选项，并始终为这个缓存组创建块。 */
                    enforce: false,
                    /* 如果依赖在其他chunk中已经存在,则重用该chunk,而不是重复的打包进当前chunk */
                    // reuseExistingChunk: true
                },
                lodash: {
                    test: /[\\/]node_modules[\\/](lodash)[\\/]/,
                    name:"lodash"
                }
            }
        }
    },
```
