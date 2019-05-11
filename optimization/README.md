
# webpack构建优化

```json
/* 初始 */
"opt0": "npx webpack --config optimization/case0/webpack.config.js",
/* 代码分块 */
"opt1": "npx webpack --config optimization/case1-splitting/webpack.config.js",
/* 按需导入 */
"opt2": "npx webpack --config optimization/case2-async/webpack.config.js",
/* tree-shaking */
"opt3": "npx webpack --config optimization/case3-treeshaking/webpack.config.js",
/* 压缩 */
"opt4": "npx webpack --config optimization/case4-minify/webpack.config.js",
/* cdn dev模式 */
"opt5-dev": "npx webpack --config optimization/case5-cdn/webpack.config.dev.js",
/* cdn pro模式 */
"opt5-pro": "npx webpack --config optimization/case5-cdn/webpack.config.prod.js",
/* dll */
"opt6": "npx webpack --config optimization/case6-dll/webpack.config.js",
/* 生成dll */
"opt6-dll": "npx webpack --config optimization/case6-dll/webpack.dll.config.js",
```

> [documentation](/doc/optimization.md)