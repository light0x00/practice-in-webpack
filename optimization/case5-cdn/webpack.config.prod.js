
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.js');

var config = merge(baseConfig, {
    mode: 'production',
    optimization:{
        sideEffects: true,
    }
    
})
module.exports = config
