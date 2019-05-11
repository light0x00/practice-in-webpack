const { join: _join, resolve: _resolve } = require('path');
const fs = require('fs');
let CleanWebpackPlugin = require('clean-webpack-plugin')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');


let config = {
    stats: 'verbose',
    mode: "production",
    // mode: "development",
    // devtool: 'hidden-source-map',
    devtool: 'nosources-source-map',
    // devtool: 'eval-source-map',
    // devtool: false,
    devServer: {

    },
    entry: {
        entry1: _resolve(__dirname, "src/main.ts"),
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
            '@': _resolve(__dirname, "./src"),
        },
        modules: [
            'node_modules',
            _resolve(__dirname, './modules')
          ]
    },
    optimization: {
        /* 让webpack确定每个模块的导出 */
        // providedExports: true,
        //让webpack确定每一个模块被用过的导出(依赖于providedExports)
        // usedExports: true,
        /* 很操蛋的设置, 
            在package.json中 表示「当前package是否含有副作用」
            在webpack配置中 表示「是否tree-shaking无副作用的代码」
        */
        sideEffects: true,
        /* https://github.com/webpack-contrib/uglifyjs-webpack-plugin */
        minimize: true,
        minimizer: [
            /* https://webpack.js.org/plugins/terser-webpack-plugin/ */
            /* https://github.com/terser-js/terser */
            new TerserPlugin({
                terserOptions: {
                    dead_code:true,
                    warnings: false,
                }
            })
        ],


    }
    ,
    module: {
        rules: [
            // {
            //     test: /\.js$/,
            //     loader: 'babel-loader',
            // },
            {
                test: /\.ts$/,
                use: ['babel-loader', { loader: "ts-loader", options: { appendTsSuffixTo: [/\.vue$/] } }]
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
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ filename: `index.html`, chunks: ["entry1"] }),
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            reportFilename: "analyzer-report.html",
            openAnalyzer: false,
        }),
        /* webapck默认会在production模式启用 不需要手动配置 */
        // new UglifyJsPlugin({ sourceMap: true }),
    ]
};

module.exports = config;

