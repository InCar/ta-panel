const path = require('path');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    mode: 'development',
    entry: './src/App.ts',
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.js',
        clean: true
    },
    watch: true,
    watchOptions: {
        ignored: /node_modules/
    },
    module: {
        rules: [{
            test: /\.ts$/,
            use:{
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                }
            },
            exclude: /node_modules/
        },
        {
            test: /\.vue$/,
            use: 'vue-loader'
        },
        {
            test: /\.(scss)$/,
            use: [
                { loader: 'style-loader' },
                { loader: 'css-loader' },
                {
                    loader: 'postcss-loader',
                    options: { postcssOptions:{ plugins: ()=>[ require('autoprefixer')] } }
                },
                { loader: 'sass-loader' }
            ]
        }]
    },
    resolve: {
        extensions: ['.vue', '.ts', '.js'],
        alias: {
            'vue' : 'vue/dist/vue.esm-bundler.js'
        }
    },
    plugins:[
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false
        })
    ]
};