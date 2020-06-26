const path = require('path');
const webpack = require('webpack');
module.exports = {

    // webpack will take the files from ./src/index
    entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
    },

    // and output it into /dist as bundle.js
    output: {
        path: path.join(__dirname, '/lib'),
        filename: 'index.js',
        libraryTarget: 'umd'
    },
    externals: [
        {
            react: 'react',
            'react-dom': 'react-dom'
        }],
    // adding .ts and .tsx to resolve.extensions will help babel look for .ts and .tsx files to transpile
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },

    module: {
        rules: [

            // we use babel-loader to load our jsx and tsx files
            {
                test: /\.(ts|js)x?$/,
                exclude: [/node_modules/, /__test__/],
                use: {
                    loader: 'babel-loader'
                },
            },

            // css-loader to bundle all the css files into one file and style-loader to add all the styles  inside the style tag of the document
            {
                test: /\.css$/,
                use: [{ loader: 'style-loader' },
                {
                    loader: 'css-loader',
                    options: {
                        modules: { localIdentName: '[name]__[local]__[hash:base64:5]' },

                    }
                }],
                include: path.resolve(__dirname, '../')
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                },
            }
        ]
    }
};
