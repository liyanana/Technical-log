//整体的webpack配置文件 但是不使用这个因为要分离开发环境和生产环境

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
/**
如果 webpack.config.js 存在，则 webpack 命令将默认选择使用它。我们在这里使用 --config 选项只是向你表明，可以传递任何名称的配置文件。这对于需要拆分成多个文件的复杂配置是非常有用的。
 * 
 */
module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js",
    // print: "./src/print.js",
  },
  //可以将编译后的代码映射回原始源代码。如果一个错误来自于 b.js，source map 就会明确的告诉你。
  devtool: "inline-source-map", //将编译后的代码映射回原始源代码
  //告知 dev server，从什么位置查找文件：
  devServer: {
    static: "./dist",
    hot: true,
  },
  //以上配置告知 webpack-dev-server，在 localhost:8080 下建立服务，将 dist 目录下的文件，作为可访问文件。
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true, //打包构建之前清除dist目录
    publicPath: "/", // //publicPath 也会在服务器脚本用到，以确保文件资源能够在 http://localhost:3000 下正确访问，我们稍后再设置端口号。下一步就是设置我们自定义的 express 服务
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Development",
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  mode: "production", // uglifyjs 压缩插件 可以tree shaking进行剪枝
};
