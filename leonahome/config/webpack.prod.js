const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
module.exports = merge(common, {
  devtool: "nosources-source-map",
  plugins: [].concat(process.env.ANALYZER ? [new BundleAnalyzerPlugin()] : []),
  optimization: {
    /**
     * SplitChunksPlugin 插件可以将公共的依赖模块提取到已有的入口 chunk 中，
     * 或者提取到一个新生成的 chunk。让我们使用这个插件，将之前的示例中重复的 lodash 模块去除：
     */
    splitChunks: {
      //这表明将选择哪些 chunk 进行优化。当提供一个字符串，有效值为 all，async 和 initial。设置为 all 可能特别强大，因为这意味着 chunk 可以在异步和非异步 chunk 之间共享。
      chunks: "all",
    },
  },
  mode: "production",
});
