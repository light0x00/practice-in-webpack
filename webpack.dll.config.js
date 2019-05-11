/*  此配置文件用于给指定的库生成bundle */
const { join: _join, resolve: _resolve } = require('path');
const webpack = require('webpack');

module.exports = {
    mode:"production",
    entry: {
        bundle: [
            'vue',
            'vue-router',
            //其他库
            ],
    },
    output: {
        path: _resolve(__dirname, 'build'),
        filename: '[name].js',
        /* Combine this plugin with output.library option to expose (aka, put into the global scope) the dll function. */
        library: '[name]_library',
        /* https://webpack.js.org/configuration/output/#outputlibrarytarget */
        libraryTarget:'var'
    },
    plugins: [
        /*  It creates a manifest.json file, which is used by the DllReferencePlugin to map dependencies. */
        new webpack.DllPlugin({
            /* context of requests in the manifest file (defaults to the webpack context. */
            // context
            /* 模块映射清单文件生成路径 */
            path: './build/bundle.manifest.json',
            name: '[name]_library',
        })
    ]
};