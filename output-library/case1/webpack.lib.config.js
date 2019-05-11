const { join: _join, resolve: _resolve } = require('path');
const fs = require('fs');
let CleanWebpackPlugin = require('clean-webpack-plugin')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

let config = {
    // mode:"production",
    mode: "development",
    // devtool: 'eval-source-map',
    devServer: {

    },
    entry: {
        'my-comps': _resolve(__dirname, "src/comps/index.ts"),
    }
    ,
    output: {
        path: _resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        /* entry的导出的变量名 */
        library:"myComps",
        /* 
        entry的导出挂在哪个全局变量上
            var     myComps = entry            直接使用作为全局变量(变量名取决于library配置)
            this    this["myComps"] = entry    这将挂在window上
        */
        libraryTarget:'this'

    },
    resolve: {
        extensions: ['.vue', '.js', '.ts'],
        alias: {
            '@': _resolve(__dirname, "./src"),
        }
    },
    externals: {
        "vue":"Vue"
    },
    optimization: {
        // minimize:true,
        // export * from 'xx'
        /* 让webpack确定每个模块的导出 */
        // providedExports: false,
        //让webpack确定每一个模块被用过的导出(依赖于providedExports)
        // usedExports: false,
        // "sideEffects": false,
    }
    ,
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
            },
            {
                test: /\.ts$/,
                use: ["babel-loader", { loader: "ts-loader", options: { appendTsSuffixTo: [/\.vue$/] } }]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.css$/, use: [
                    { loader: "style-loader" },
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                        }
                    },
                    'css-loader',
                ]
            },
            {
                test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name(file) {
                                return '[name].[ext]'
                            },
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        // new MiniCssExtractPlugin({
        //     filename:  "[name].css" ,
        //     chunkFilename: "[id].css"
        // }),
        new VueLoaderPlugin(),
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            reportFilename: "analyzer-report.html",
            openAnalyzer: false,
        }),
        new HtmlWebpackPlugin({template:_resolve(__dirname,"./src/index.html")})
        // new webpack.DllReferencePlugin({
        //     context: '.',
        //     manifest: require("./build/bundle.manifest.json"),
        // }),
    ]
};

module.exports = config;

