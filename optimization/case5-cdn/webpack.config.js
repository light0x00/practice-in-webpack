const { join: _join, resolve: _resolve } = require('path');
let CleanWebpackPlugin = require('clean-webpack-plugin')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const StatsPlugin = require('stats-webpack-plugin');

let config = {

    profile:true,
    // parallelism:1,

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
        },
        modules: [_resolve(__dirname,'../../node_modules')],
    },
    optimization: {
        // runtimeChunk: {
        //     name: entrypoint => `runtime`
        // },
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
                // test: /(\.js)$/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                },
                // include: _resolve(__dirname, 'src'),
                // exclude: _resolve(__dirname,' ../../node_modules')
            },
            // {
            //     test: /\.ts$/,
            //     use: ["babel-loader", { loader: "ts-loader", options: { appendTsSuffixTo: [/\.vue$/] } }]
            // },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.css$/, 
                use: [
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
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new VueLoaderPlugin(),
        // new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ filename: `entry1.html`, template: _resolve(__dirname, "./src/entry1/index.html"), chunks: ["entry1", "default", "vendors", "runtime"] }),
        new HtmlWebpackPlugin({ filename: `entry2.html`, template: _resolve(__dirname, "./src/entry2/index.html"), chunks: ["entry2", "default", "vendors", "runtime"] }),
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            reportFilename: "analyzer-report.html",
            openAnalyzer: false,
        }),
        new webpack.ProvidePlugin({
            _: 'lodash-es'
        })
    ]
};

module.exports = config;

