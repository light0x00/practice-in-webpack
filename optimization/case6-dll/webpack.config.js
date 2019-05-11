const { join: _join, resolve: _resolve } = require('path');
const fs = require('fs');
let CleanWebpackPlugin = require('clean-webpack-plugin')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// let HappyPack = require('happypack')
// let os = require('os')
// let happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })


let config = {
    // mode:"production",
    mode: "development",
    devtool: false,
    // parallelism: 8,
    devServer: {

    },
    entry: {
        entry1: _resolve(__dirname, "src/entry1/main.ts"),
        entry2: _resolve(__dirname, "src/entry2/main.ts"),
    }
    ,
    output: {
        path: _resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
    },
    resolve: {
        extensions: ['.vue', '.js', '.ts'],
        alias: {
            // 'vue$': 'vue/dist/vue.runtime.esm',
            '@': _resolve(__dirname, "./src"),
        }
    },
    externals: {
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: {
                    chunks:"initial",
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    name: "vendors",
                },
                default: {
                    chunks:"initial",
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                    name: "default",
                }
            }
        }
    }
    ,
    module: {
        
        rules: [
            
            {
                test: /(\.js)|(\.ts)$/,
                use: [{ loader: 'babel-loader', options: { cacheDirectory: true } }],
            },
            {
                test: /\.ts$/,
                use: ["babel-loader", { loader: "ts-loader", options: { appendTsSuffixTo: [/\.vue$/]} }]
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
        new VueLoaderPlugin(),
        new webpack.ProgressPlugin(),
        // new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: `entry1.html`, template: _resolve(__dirname, "./src/entry1/index.html"), chunks: ["entry1", "default", "vendors", "vendors_dll"],
            templateParameters: { "vendors_dll_path": _resolve(__dirname, "./dll/vendors_dll.js") } /* ⚠️生产环境请改为实际的dll路径 */
        }),
        new HtmlWebpackPlugin({
            filename: `entry2.html`, template: _resolve(__dirname, "./src/entry2/index.html"), hunks: ["entry2", "default", "vendors", "vendors_dll"],
            templateParameters: { "vendors_dll_path": _resolve(__dirname, "./dll/vendors_dll.js") }
        }),
        new MiniCssExtractPlugin({ ilename: "[name].css", chunkFilename: "[id].css" }),
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            reportFilename: "analyzer-report.html",
            openAnalyzer: false,
        }),
        /* https://webpack.js.org/plugins/dll-plugin/ 
            scope  The content of the dll is accessible under a module prefix. i.e. with scope = 'xyz' a file abc in the dll can be access via require('xyz/abc').
            name    dll的的导出对应的全局变量(即webpack.dll.config.js中的library的值) 使用默认配置manifest.name(表示从manifest.json里面取)即可
            content dll内的模块与实际路径的映射关系(默认从manifest.content里面取)
        */
        new webpack.DllReferencePlugin({
            // context: __dirname,
            manifest: require("./dll/vendors_dll.manifest.json"),
        }),
    ]
};

module.exports = config;

