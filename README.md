
# Chunk Spliting

[TOC]

## 0. 前置约定

1. 动态导入的模块称为`异步模块`,普通导入的模块称为`同步模块`,这样称呼是从import返回的是否为Promise的角度来划分的
2. `splitingChunks.*`表示 splitingChunks下的所有配置项

## 1. What

## 2. Why

引用官方文档

## 3. 初识Chunk-Spliting

### 3.1 splitChunks的默认配置

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

1. 只对异步导入(也叫动态导入)的模块做优化
    > ⚠️这正是本文上面提到的问题的根本原因,默认不会对普通导入的代码做任何处理!!
2. 大于30k的依赖
    > 可能官方认为小模块拆分出来 对于体积优化不明显,反而会由于请求次数多而增加网络io的开销(详见tcp/ip协议族)
3. 至少被2个未分割前的chunk共享
    > 被未分割前的chunk(`chunks before spliting`)这是官方文档中屡屡提到的一个词,指你所配置的`entry`
4. 页面加载时 发生的chunk请求数最多3个
    > 这是为了防止拆分的太碎,导致请求数过多),意味着普通导入的模块最多被分为3个
5. 对于动态导入的模块产生的chunk请求不能多于5个
    > 意味着一个entry内,异步请求的模块最多拆分为5份
6. `/node_modules/`中的同步模块(如果满足其他条件)会被打包到 `vendors~*.js`,其他的所有同步模块会被打包到`default~*.js`中

### 3.2 配置优先级

好了看到这里,你应该有一个疑问了———

假设设置了maxSize=100k,maxInitialRequest=2,且现在有3个大于100k的共享模块都符合其他所有拆分条件. 这时如果把它们拆为3个chunk就违反了maxInitialRequest,而不拆的话选择把共享模块打包在一起又违反了maxSize

你会发现,webpack的配置是自相矛盾的,但是好在webpack规定了配置优先级:

> Actual priority is maxInitialRequest/maxAsyncRequests < maxSize < minSize.

所以上面的命题的结果是: 会分出3个chunk,因为minSize的优先级最大

除此以外,`cacheGroup`内的配置的优先级也会高于`optimization.splitChunks.*`

### 3.3 默认配置存在的问题

正如本文开头所展示的例子,我们同步导入了的共享模块`lodash`被分别打包到了两个chunk中. 这是因为默认配置只对异步模块做优化.

如果要优化同步模块:

```js
splitChunks:{
    chunks:"all"
}
```

### 3.4 对异步模块的处理

**`splitingChunks.*`的配置项中除了`chunks`、`maxAsyncRequests` 外,都不对异步模块起作用**
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

### 动态导入

- webpackChunkName
- webpackMode
  - lazy    延迟加载,默认值
  - eager   始终将该模块与当前entry打包到同一个chunk里(这意味着,对于当前entry而言 webpackChunkName将无效).
          这意味着,如果该模块还被其他entry动态导入,是无法重用的(该模块将同时存在于多个chunk)
  - weak    如果该模块所在的chunk已经被引入了(被浏览器下载过)则重用,否则加载失败并抛出异常

- webpackPrefetch
    设置后浏览器会在空闲时下载这个module所在的chunk,算是一种削峰填谷机制吧
    > 👉[了解浏览器prefetch机制][mdn_prefresh]
- webpackPreloading
    设置后这个异步module所在的chunk会在页面加载时与父chunk并行加载

[mdn_prefresh]:https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Link_prefetching_FAQ

## 4. 实践

### 4.1 针对普通导入

这种情况处理相对简单,工程结构如下

- common.js
- entry1.js
- entry2.js
 
 👉[示例代码](https://github.com/light0x00/learn-webpack-chunk-spliting/tree/master/examples/example1)

我们的需求也很简单,就是把common.js分到一个独立的chunk. 配置如下

```js
splitChunks: {
    /* 针对同步/异步导入的模块 */
    chunks: 'all',
    /* 默认`common.js<30kb`common是不会被分开的(原因上文已经提到). 如果你跟我一样有强迫症,添加如下配置 */
    minSize: 0,
}
```

### 4.2 针对动态导入

这种情况处理相对简单,工程结构如下

- common.js
- entry1.js
- entry2.js

entry1\entry2 都动态导入了common.js.

如果只是为了抽离公共异步模块的需求,不需任何要配置. 

### 4.3 混合



## 5. 相关文档

[code-splitting](https://webpack.js.org/guides/code-splitting/)

[split-chunk-plugin](https://webpack.js.org/plugins/split-chunks-plugin/)

[module-method](https://www.webpackjs.com/api/module-methods/)

[dynamic-imports](https://webpack.js.org/guides/code-splitting/#dynamic-imports)