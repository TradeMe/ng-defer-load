var webpack = require('webpack');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

module.exports = {
    debug: true,
    entry: './index.js',
    output: {
        path: '.',
        filename: "defer-load.min.js",
        library: "defer-load",
        libraryTarget: "umd"
    },
    plugins: [
        new uglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};