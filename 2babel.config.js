/* https://babeljs.io/docs/en/next/configuration */
module.exports = function (api) {
    api.cache(true);

    const presets = [
        //https://babeljs.io/docs/en/next/babel-preset-env.html
        "@babel/env",
        {
            "targets": {
                "browsers": [
                    "last 2 versions",
                    "safari >= 7",
                    "chrome>=52"
                ],
            },
            "spec": false,
            // "esmodules": true,
            // "modules": false,
            "useBuiltIns": false,
            "debug": false, //是否输出编译日志
            "include": [],
            "exclude": []
        }
    ];

    const plugins = [
        "@babel/plugin-syntax-dynamic-import", //处理异步倒入模块
        [
            "@babel/plugin-transform-runtime", //提供填充\转换辅助方法
            {
                "helpers": true, // 是否自动添加辅助方法
                "corejs": false, // 你使用的babel-runtime版本   if use @babel-runtime,set false, if use @babel-runtime-corejs2,set 2
                "regenerator": true, //是否启用generator填充
                "useESModules": false
            }
        ]
    ];

    return {
        presets,
        plugins
    };
}