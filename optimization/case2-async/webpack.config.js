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
    // mode: "development",
    devtool: false,
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
            'vue$': 'vue/dist/vue.runtime.esm',
            '@': _resolve(__dirname, "./src"),
        }
    },
    externals: {
    },
    optimization: {
        sideEffects:false,
        // mergeDuplicateChunks: true,
        /* 将webpack runtime独立打包,Setting optimization.runtimeChunk to true or "multiple" adds an additional chunk to each entrypoint containing only the runtime */
        runtimeChunk: {
            name: entrypoint => `runtime`
        },
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: false,
            cacheGroups: {
                vendors: {
                    chunks:'initial',
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    name: "vendors",
                },
                default: {
                    chunks:'initial',
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
        new MiniCssExtractPlugin({
            filename:  "[name].css" ,
            chunkFilename: "[id].css"
        }),
        new VueLoaderPlugin(),
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ filename: `entry1.html`, template: _resolve(__dirname,"./src/entry1/index.html"), chunks: ["entry1", "default", "vendors","runtime"] }),
        new HtmlWebpackPlugin({ filename: `entry2.html`, template: _resolve(__dirname,"./src/entry2/index.html"), chunks: ["entry2", "default", "vendors","runtime"] }),
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

