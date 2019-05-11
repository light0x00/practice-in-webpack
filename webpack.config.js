const { join: _join, resolve: _resolve } = require('path');
const fs = require('fs');
let CleanWebpackPlugin = require('clean-webpack-plugin')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let config = {
    // mode:"production",
    mode: "development",
    devtool: 'eval-source-map',
    devServer: {

    },
    entry: {
        entry1: _resolve(__dirname, "src/entry1/main1.ts"),
        entry2: _resolve(__dirname, "src/entry2/main1.ts"),
    }
    ,
    output: {
        path: _resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
    },
    resolve: {
        extensions: ['.vue', '.js', '.ts'],
        alias: {
            // 'vue$': 'vue/dist/vue.esm',
            '@': _resolve(__dirname, "./src"),
        }
    },
    externals: {
        // vue: 'vue',
        // vue: 'vue',

    },
    optimization: {
        // minimize:true,
        // export * from 'xx'
        /* 让webpack确定每个模块的导出 */
        // providedExports: false,
        //让webpack确定每一个模块被用过的导出(依赖于providedExports)
        // usedExports: false,
        // "sideEffects": false,
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
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    name: "vendors",
                },
                default: {
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
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ filename: `entry1.html`, template: "./src/entry1/index.html", chunks: ["entry1", "default", "vendors"] }),
        new HtmlWebpackPlugin({ filename: `entry2.html`, template: "./src/entry2/index.html", chunks: ["entry2", "default", "vendors"] }),
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            reportFilename: "analyzer-report.html",
            openAnalyzer: false,
        }),
        // new webpack.DllReferencePlugin({
        //     context: '.',
        //     manifest: require("./build/bundle.manifest.json"),
        // }),
    ]
};

module.exports = config;

