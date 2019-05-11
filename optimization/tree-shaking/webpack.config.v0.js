const { join: _join, resolve: _resolve } = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin');

let webpack = require('webpack')
let CleanWebpackPlugin = require('clean-webpack-plugin')
let HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


let config = {
    // stats: 'verbose',
    // mode: "production",
    mode: "development",
    devtool: false,
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
        extensions: ['.js', '.ts'],
        alias: {
            '@': _resolve(__dirname, "./src"),
        },
        modules: [
            'node_modules',
            _resolve(__dirname, './modules')
        ]
    },
    optimization: {
        sideEffects: true,
        // minimizer: [
        //     /* https://webpack.js.org/plugins/terser-webpack-plugin/ */
        //     /* https://github.com/terser-js/terser */
        //     new TerserPlugin({
        //         /* 对哪些文件做minify  String|RegExp|Array<String|RegExp> */
        //         // test: /\.js(\?.*)?$/i,
        //         include: [/\.css/],
        //         // exclude:[/\.ts/,/\.\/optimization\/tree-shaking\/src\/module1\.ts/],
        //         /* 这个函数用于决定对哪些chunk做minify */
        //         chunkFilter: (chunk) => {
        //             // Exclude uglification for the `vendor` chunk
        //             // if (chunk.name === 'vendor') {
        //                 // return false;
        //             // }
        //             console.log(chunk.name)
        //             return true;
        //         },
        //         cache: true,
        //         parallel: true, /* Use multi-process parallel running to improve the build, Default number of concurrent runs:  speed os.cpus().length - 1 */
        //         /* 是否生成sourceMap */
        //         sourceMap: false,
        //         terserOptions: {
        //             /* 没有作用 */
        //             compress: {
        //                 /* 没有作用 */
        //                 // side_effects: true,
        //                 // dead_code: true,
        //                 warnings: false,
        //                 /* 删除console */
        //                 drop_console: true,
        //                 /* 删除debugger关键字(es6中用于打断点的) */
        //                 drop_debugger: false,
        //                 /*  保留类名*/
        //                 keep_classnames: true,
        //                 /*  保留方法参数名*/
        //                 keep_fargs: true,
        //                 /*  保留方法名*/
        //                 keep_fnames: true,
        //             },
        //             output: {
        //                 beautify: false,
        //                 /* 是否保留注释  */
        //                 comments: false, // (default false) -- pass true or "all" to preserve all comments, "some" to preserve some comments, a regular expression string (e.g. /^!/) or a function.
        //             },
        //         },
        //     }),
        // ],
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
                use: ['babel-loader', { loader: "ts-loader", options: { appendTsSuffixTo: [/\.vue$/] } }]
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
            filename: "[name].css",
            chunkFilename: "[id].css",
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ filename: `index.html`, chunks: ["entry1"] }),
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            reportFilename: "analyzer-report.html",
            openAnalyzer: false,
        }),
    ]
};

module.exports = config;

