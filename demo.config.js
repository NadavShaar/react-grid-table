const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        bundle: "./demo/src/index.js",
    },
    output: {
        path: __dirname + '/demo/dist/build',
        filename: '[name].js'
    },
    devServer: {
        publicPath: path.join(__dirname, '/demo/dist'),
        contentBase: path.join(__dirname, '/demo/dist'),
        port: 9000,
        writeToDisk: true
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: ['@babel/plugin-proposal-object-rest-spread', "@babel/plugin-transform-runtime"]
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        // new HtmlWebpackPlugin({
        //     template: __dirname + '/demo/src/index.html',
        //     filename: 'index.html',
        //     inject: 'body',
        // })
    ],
    resolve: {
        extensions: [".js", ".jsx"]
    },
    externals: {
    }
}