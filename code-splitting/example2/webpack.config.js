const { join: _join, resolve: _resolve } = require('path');
const fs = require('fs');
let CleanWebpackPlugin = require('clean-webpack-plugin')
let HtmlWebpackPlugin = require('html-webpack-plugin')
// let MiniCssExtractPlugin = require('mini-css-extract-plugin')
let webpack = require('webpack')

let config = {
    // mode:"development",
    mode: "development",
    entry: {
        entry1: _resolve(__dirname, "src/entry1/main.js"),
        // entry2: _resolve(__dirname, "./src/entry2/main.js"),
    }
    ,
    output: {
        path: _resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
    },
    module: {
        rules: [

        ]
    },
    optimization: {
        splitChunks:{
            chunks:"initial",
            maxAsyncRequests: 1,
            maxSize:100,
            minSize:0
        }
        /* 只打算优化async模块时, 使用默认配置即可 */
        // splitChunks: {
        //     chunks: 'all',
        //     minSize: 30000,
        //     maxSize: 0,
        //     minChunks: 2,
        //     maxAsyncRequests: 2,
        //     maxInitialRequests: 3,
        //     automaticNameDelimiter: '~',
        //     name: true,
        //     cacheGroups: {
        //         vendors: {
        //             test: /[\\/]node_modules[\\/]/,
        //             priority: -10
        //         },
        //         default: {
        //             name:"default",
        //             minChunks: 2,
        //             priority: -20,
        //             reuseExistingChunk: true
        //         }
        //     }
        // }
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ filename: `index.html`, chunks: ["entry1","default","vendors","common"] }),
    ]
};

module.exports = config;

