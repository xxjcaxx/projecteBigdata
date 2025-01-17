const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


module.exports = {
 mode: 'development', // o production
entry: './src/engine.js',
output: {
  filename: 'main.js',
  path: path.resolve(__dirname, 'dist'),
},
devServer: {
   static: './dist',
 },
 plugins: [
 //  new CleanWebpackPlugin(),

   new HtmlWebpackPlugin({
       title: 'Fake Generator',
      filename: 'index.html',
      template: 'src/index.html',
      
   }),
],

module: {
   rules: [
     {
       test: /\.(png|svg|jpg|gif)$/,
       type: "asset/resource",
     },
     {
       test: /\.css$/,
       use: [
         'style-loader',
         'css-loader',
       ],
     },
     {
       test: /\.(scss)$/,
       use: [
         {
           loader: 'style-loader'
         },
         {
           loader: 'css-loader'
         },
         {
           loader: 'postcss-loader',
           options: {
             postcssOptions: {
               plugins: () => [
                 require('autoprefixer')
               ]
             }
           }
         },
         {
           loader: 'sass-loader'
         },
    
       ]
     }
   ]
 }
};



