const { join: _join, resolve: _resolve } = require('path');
const fs = require('fs');
let CleanWebpackPlugin = require('clean-webpack-plugin')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

let config = {
    mode:"production",
    devtool: false,
    devServer: {

    },
    entry: {
        vendors_dll: [
            'vue','lodash','axios','vue-router'
        ]
    }
    ,
    output: {
        path: _resolve(__dirname, 'dll'),
        filename: '[name].js',
        /* 「entry的导出」的变量名 */
        library:"[name]",
        /* 
        「entry的导出」挂在哪个全局变量上
            var     myComps = entry            直接使用作为全局变量(变量名取决于library配置)
            this    this["myComps"] = entry    这将挂在window上
        */
        libraryTarget:'var'

    },
    resolve: {
        extensions: ['.vue', '.js', '.ts'],
        alias: {
            '@': _resolve(__dirname, "./src"),
        }
    },
    externals: {
        // "vue":"Vue"
    },
    module: {
        rules: [
            {
                test: /(\.js)|(\.ts)$/,
                loader: 'babel-loader',
            },
        ]
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            reportFilename: "analyzer-report.html",
            openAnalyzer: false,
        }),
        /*  It creates a manifest.json file, which is used by the DllReferencePlugin to map dependencies. */
        new webpack.DllPlugin({
            /* context of requests in the manifest file (defaults to the webpack context. */
            // context
            /* 模块映射清单文件生成路径 */
            path: _resolve(__dirname,'./dll/[name].manifest.json'),
            /* entry的全局变量名称,应与 output.library一致 */
            name: '[name]',
        })
    ]
};

module.exports = config;

