const { join: _join, resolve: _resolve } = require('path');
var fs = require('fs');
let CleanWebpackPlugin = require('clean-webpack-plugin')
let HtmlWebpackPlugin = require('html-webpack-plugin')
// let MiniCssExtractPlugin = require('mini-css-extract-plugin')
let webpack = require('webpack')

let config = {
    // mode:"development",
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
    optimization:{
        splitChunks:{
            // reuseExistingChunk:true\
            chunks:"all",
            name:false,
            maxAsyncRequests:1
        }
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ filename: `pageA.html`, chunks: ["entry1","default"] }),
        new HtmlWebpackPlugin({ filename: `pageB.html`, chunks: ["entry2","default"] }),
        // new MiniCssExtractPlugin({
        //     // Options similar to the same options in webpackOptions.output
        //     // both options are optional
        //     filename: "[name].css",
        //     chunkFilename: "[id].css"
        // })

    ]
};

module.exports = config;

