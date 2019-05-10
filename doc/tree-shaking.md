# t

项目结构

```txt
├── src
   ├── main.ts
   └── module1.ts
```

main.ts

```ts
import {foo} from './module1'

foo()
```

module1.ts

```ts
export function foo(){
    console.log("Hello foo")
}

export function bar(){
    console.log("Hello bar")
}
```

## 1. providedExports

```js
    optimization: {
        /* 让webpack确定每个模块的导出 */
        providedExports: true,
        //让webpack确定每一个模块被用过的导出(依赖于providedExports)
        usedExports: true,
    }
```

配置以上两项后将发现构建结果中多了两行注释:

```js
/***/ "./examples/tree-shaking/src/main.ts":
/*!*******************************************!*\
  !*** ./examples/tree-shaking/src/main.ts ***!
  \*******************************************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {
省略...
/***/ }),

/***/ "./examples/tree-shaking/src/module1.ts":
/*!**********************************************!*\
  !*** ./examples/tree-shaking/src/module1.ts ***!
  \**********************************************/
/*! exports provided: square, cube */
/*! exports used: cube */
```

其中,「module1.ts」完整的编译代码如下:

```js
/* unused harmony export square */
/* harmony export (binding) */
__webpack_require__.d(__webpack_exports__, \"a\", function() { return cube; });
function square(x) {    return x * x;}
function cube(x) {    return x * x * x;}
```

可以看到square方法还没有被shaking掉,但多了一行「unused harmony export bar」.

> 1.「harmony」是es2015的别名, 「`__webpack_require__.d`」是用来向「webpack模块容器」注册模块的.
> 2. 有趣的是,可以看到源码中export了square,但是构建结果中square并未被组册到「webpack模块容器」

## 2.sideEffect

> A "side effect" is defined as code that performs a special behavior when imported, other than exposing one or more exports. An example of this are polyfills, which affect the global scope and usually do not provide an export.

对于「副作用」的解释,官方特意举了一个例子————polyfills

消除副作用需要注意

1. 必须使用es模块标准构建.

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

2. 引入的模块在package.json中设置了`sideEffect:false`
3. 你的项目中开启sideEffects

    ```js
    //webpack.config.js
    optimization: {
        sideEffects: true, //production环境默认开启
    }
    ```

4. tree-shaking只在production模式起作用.

    > 当然理论上你把webpack在production环境的默认配置自己手动配一遍应该也可能实现(👉[webpack-mode](https://webpack.js.org/configuration/mode#usage))

5. 对与有副作用的模块,在package.json的`sideEffect`中标出.

    以下例子演示`tree-shaking`将把`elementRegister.ts` 清除

    ```js
    //elementRegister.ts  原本我们希望使用vue的动态组件来按需引入element
    import Vue from 'vue'
    Vue.component('el-button',() => import('element-ui/packages/button/index.js'))
    //main.ts
    import 'elementRegister'
    ```

    `elementRegister.ts`是有副作用的,tree-shaking是基于export/import来确定「dead code」,而elementRegister.ts并**没有export过任何module**,即使在main.ts `import 'elementRegister'`, tree-shaking插件(TesterPlugin)也会认为这个是「导入但未使用的dead code」.

    解决这个问题要么关闭


      "sideEffects": ["*.css","optimization/case3-treeshaking/src/comps/index.ts"],