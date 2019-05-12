# minify

Webpack4中使用`TesterPlugin`对代码做压缩(包含变量名压缩、注释清除、console语句清除等、语法简化),默认在production环境会自动启用. 这个插件内部基于`tester-js`,fork自`uglifyEs`(uglifyEs已经不再维护)

> [tester-js](https://github.com/terser-js/terser),[TesterPlugin](https://webpack.js.org/plugins/terser-webpack-plugin/)

## scope hiost

tester.js中和scope hiost相关的配置解释如下

```js
hoist_funs (default: false) -- hoist function declarations

hoist_props (default: true) -- hoist properties from constant object and array literals into regular variables subject to a set of constraints. For example: var o={p:1, q:2}; f(o.p, o.q); is converted to f(1, 2);. Note: hoist_props works best with mangle enabled, the compress option passes set to 2 or higher, and the compress option toplevel enabled.

hoist_vars (default: false) -- hoist var declarations (this is false by default because it seems to increase the size of the output in general)
```

## tree-shaking

用好tree-shaking的关键在于理解 side effect

```js
side_effects (default: true) -- Pass false to disable potentially dropping functions marked as "pure". A function call is marked as "pure" if a comment annotation /*@__PURE__*/ or /*#__PURE__*/ immediately precedes the call. For example: /*@__PURE__*/foo();
dead_code (default: true) -- remove unreachable code
```

## side effect

```js
//main.js
import Cache from './cache.js'
let a = Cache.get("foo")
```

上面这段代码中,变量`let a`会被删掉(因为没有被引用),但是`Cache.get("foo")`不会被删掉(在没有声明无副作用的情况下),因为不能确定这个方法里面干了什么,举个例子:

假如`cache.js`内部需要统计 「缓存命中率」(这是一个很常见的需求), 二这种情况如果把上面的代码中的`Cache.get("foo")`删掉,就会导命中率统计不准确.

```js
//cache.js

let hit_count = 0;  //统计缓存命中次数
let get_count = 0;  //统计get总次数
let data = new Map()

export default {
    get(key){
        get_count++;
        let val = data.get(key)
        if(val!=null)
            hit_count++
        return val;
    }

    hitsRate(){
        return hit_count/get_count;
    }
}
```

## 如何使tree-shaking生效

### 1. 必须使用es模块标准构建

如果使用ts

```json
//tsconfig.json
{
    "compilerOptions": {
        "module": "esNext", /* es2015 或者 esNext */
    }
}
```

如果使用babel的`env-preset`

```js
//.babelrc
"@babel/env",
{
    "modules":false,
}
```

> 因为`TesterPlugin`是基于「import/export」来标记「dead code」,不支持其他标准.

### 2. 声明无副作用

package.json告诉 webpack 一个库(或其中的某些模块)是否可以被shaking

```js
// package.json
"sideEffects": false,  //如果部分模块(指webpack的模块,即文件)有副作用,指定一个Array标出 ["src/your-side-effect-module.js","*.css"]
```

> 每个库的package.json只对其自身起作用(其实这是废话,但还是强调一下)

### 3. 启用tree-shaking

webpack.json中的`sideEffect`告诉webpack是否开启tree-saking功能.

```js
//webpack.config.js
optimization: {
    sideEffects: true, //production环境默认开启
}
```

### 4. 不应该 ProvidePlugin

通常我们会使用ProvidePluginal让自己少写一行`import`, 但是这样的代价是tree-shaking会失败, 因为源码中没有使用`import`而无法被标记哪些模块是Dead Code. 

```js
//webpack.config.js
new webpack.ProvidePlugin({
            _: 'lodash-es'
        })
//xx.js
console.log(_.add(1,2))
```

编译后:

```js
/* WEBPACK VAR INJECTION */
(function(_) {
    console.log(_.add(1, 2));
    /* WEBPACK VAR INJECTION */
}.call(this, __webpack_require__(/*! lodash-es */
"./node_modules/lodash-es/lodash.js")))
```

> 从打包结果上看,

## 一个常见的误解

一个常见的误解是认为`import *`会导致无法tree-skaing,在webpack4上并不是这样. 如下例子可以证明webpack4还是相当「智能」的.

```js
import * as _ from `lodash-es`
//编译后
 var lodash_es__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash-es */"./node_modules/lodash-es/add.js");
```


## 一个常见的坑

下面是一个由于「没有正确设置副作用」带来的一个常见的坑.

```js
//elementRegister.ts  我们希望使用vue的动态组件来按需引入element
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
Vue.component('el-button',() => import('element-ui/packages/button/index.js'))

```

```js
//main.ts
import 'elementRegister'

// your code
```

`elementRegister.ts`是会被判定为副作用的,tree-shaking是基于export/import来确定「dead code」,而elementRegister.ts并**没有export过任何module**,即使在main.ts `import 'elementRegister'`, tree-shaking插件(TesterPlugin)也会认为这个是「导入但未使用的dead code」.

这个问题的本质是因为把**原本有副作用的模块声明为无副作用了**

```js
    "sideEffects": ["*.css","optimization/case3-treeshaking/src/comps/index.ts"],
```

## 配置

建议看官方文档

```js
        minimizer: [
            /* https://webpack.js.org/plugins/terser-webpack-plugin/ */
            /* https://github.com/terser-js/terser */
            new TerserPlugin({
                /* 对哪些文件做minify  String|RegExp|Array<String|RegExp> */
                // test: /\.js(\?.*)?$/i,
                // include: [/\.css/],
                // exclude:[/\.ts/,/\.\/optimization\/tree-shaking\/src\/module1\.ts/],
                /* 这个函数用于决定对哪些chunk做minify */
                chunkFilter: (chunk) => {
                    // Exclude uglification for the `vendor` chunk
                    // if (chunk.name === 'vendor') {
                        // return false;
                    // }
                    console.log(chunk.name)
                    return true;
                },
                cache: true,
                parallel: true, /* Use multi-process parallel running to improve the build, Default number of concurrent runs:  speed os.cpus().length - 1 */
                /* 是否生成sourceMap */
                sourceMap: false,
                terserOptions: {
                    compress: {
                        /* 没有作用 */
                        // side_effects: true,
                        // dead_code: true,
                        warnings: false,
                        /* 删除console */
                        drop_console: true,
                        /* 删除debugger关键字(es6中用于打断点的) */
                        drop_debugger: false,
                        /*  保留类名*/
                        keep_classnames: true,
                        /*  保留方法参数名*/
                        keep_fargs: true,
                        /*  保留方法名*/
                        keep_fnames: true,
                    },
                    output: {
                        beautify: false,
                        /* 是否保留注释  */
                        comments: false, // (default false) -- pass true or "all" to preserve all comments, "some" to preserve some comments, a regular expression string (e.g. /^!/) or a function.
                    },
                },
            }),
        ],
```