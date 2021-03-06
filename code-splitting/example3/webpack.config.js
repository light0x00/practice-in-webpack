const { join: _join, resolve: _resolve } = require('path');
var fs = require('fs');
let CleanWebpackPlugin = require('clean-webpack-plugin')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let webpack = require('webpack')

let config = {
    mode: "development",
    entry: {
        entry1: _resolve(__dirname, "src/entry1/main.js"),
        entry2: _resolve(__dirname, "./src/entry2/main.js"),
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
        splitChunks: {
            chunks: 'all',
            // chunks: function(chunk){
            //     // console.log("====================+>"+chunk.name,chunk)
              
            //     console.log("====================+>",chunk)
            //     // return chunk.name!=='entry1'
            //     return true
            // },
            /* 将minSize改为0 */
            minSize: 1,
            maxSize: 0,
            minChunks: 2,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: "root",
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                /* 当前示例满足这个group的要求 */
                default: {
                    name:"default",
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ filename: `pageA.html`, chunks: ["entry1","default","vendors"] }),
        new HtmlWebpackPlugin({ filename: `pageB.html`, chunks: ["entry2","default","vendors"] }),
    ]
};

module.exports = config;

