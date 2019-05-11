const { join: _join, resolve: _resolve } = require('path');
const fs = require('fs');
let CleanWebpackPlugin = require('clean-webpack-plugin')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let webpack = require('webpack')

let config = {
    // mode:"production",
    mode: "development",
    devServer:{

    },
    entry: {
        entry2: _resolve(__dirname, "src/entry2/main.ts"),
        entry1: _resolve(__dirname, "src/entry1/main.js"),
    }
    ,
    output: {
        path: _resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
    },
    module: {
        noParse: (content) => /lodash/.test(content),
        rules: [
            {
                test:/ts/,
                use:["ts-loader"]
            }
        ]
    },
    optimization: {
  
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ filename: `index.html`, chunks: ["entry1","default","asyncA","common"] }),
        // new HtmlWebpackPlugin({ filename: `index2.html`, chunks: ["entry2","default","vendors","common"] }),
    ]
};

module.exports = config;

