const { join: _join, resolve: _resolve } = require('path');
var fs = require('fs');
// let CleanWebpackPlugin = require('clean-webpack-plugin')
// let HtmlWebpackPlugin = require('html-webpack-plugin')
// let MiniCssExtractPlugin = require('mini-css-extract-plugin')
let webpack = require('webpack')

let config = {
    // mode:"development",
    mode:"development",
    entry: {
        entry1: _resolve(__dirname, "src/entry1/main.js"),
        entry2:  _resolve(__dirname,"./src/entry2/main.js"),
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
            /* 将minSize改为0 */
            minSize: 0,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                /* 当前示例满足这个group的要求 */
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    },
    plugins: [
        new webpack.ProgressPlugin(),
    ]
};

module.exports = config;

