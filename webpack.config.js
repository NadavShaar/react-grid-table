const path = require('path');
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const htmlWebpackPlugin = new HtmlWebpackPlugin({
//     template: path.join(__dirname, "examples/src/index.html"),
//     filename: "./index.html"
// });
module.exports = {
    entry: path.join(__dirname, "src/index.js"),
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        // plugins: ['@babel/plugin-proposal-object-rest-spread']
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
    // plugins: [htmlWebpackPlugin],
    resolve: {
        extensions: [".js", ".jsx"]
    },
    externals: {
        'react': 'react',
        'prop-types': 'prop-types'
    }
    // devServer: {
    //     port: 3001
    // }
}