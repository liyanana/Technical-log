const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const WebpackBar = require("webpackbar");
module.exports = {
  entry: "./src/index.tsx",
  plugins: [
    new WebpackBar(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "../index.html"),
      inject: true,
    }),
  ],
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "../dist"),
    clean: true,
    //Webpack 会在输出的 bundle 中生成路径信息。然而，在打包数千个模块的项目中，这会导致造成垃圾回收性能压力。在 options.output.pathinfo 设置中关闭：
    pathinfo: false,
    assetModuleFilename: "images/[hash][ext][query]",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        include: path.join(__dirname, "../src"),
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        include: path.join(__dirname, "../src"),
        exclude: /node_modules/,
      },
      {
        test: /\.png/,
        type: "asset/resource",
        generator: {
          filename: "static/[hash][ext][query]",
        },
      },
      {
        test: /\.scss$/,
        include: path.join(__dirname, "../src"), // 只让loader解析我们src底下自己写的文件
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
    //尝试按顺序解析这些后缀名
    //能够使用户在引入模块时不带扩展：
    extensions: [".tsx", ".ts", ".js", "scss"],
  },
  //   取消一些有关打包什么的警告
  performance: {
    hints: false,
  },
};
