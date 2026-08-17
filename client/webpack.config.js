const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const Dotenv = require('dotenv-webpack')
const { resolve } = require('dns')

module.exports = {
    entry:'src/index.js',
    output:{path:'dist', clean:true},
    resolve:{
        alias:{
            '@':'src'
        }
    },
    module:{
        rules:[]
    },
    plugins:[],
    devServer:{
        port:7777,
        historyApiFallback: true
    }

}