const { join: _join, resolve: _resolve } = require('path');
const fs = require('fs');
let CleanWebpackPlugin = require('clean-webpack-plugin')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

let config = {
    // mode:"production",
    mode: "development",
    devtool: 'eval-source-map',
    devServer: {

    },
    entry: {
        entry1: _resolve(__dirname, "src/index.ts"),
    }
    ,
    output: {
        path: _resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
    },
    resolve: {
        extensions: ['.vue', '.js', '.ts'],
        alias: {
            'vue$': 'vue/dist/vue.esm',
        }
    },
    module: {
        rules: [
            {
                test: /ts/,
                use: [{ loader: "ts-loader", options: { appendTsSuffixTo: [/\.vue$/] } }]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },

        ]
    },
    optimization: {

    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ template: "./index.html" }),
        // new HtmlWebpackPlugin({ filename: `index2.html`, chunks: ["entry2","default","vendors","common"] }),
    ]
};

module.exports = config;

