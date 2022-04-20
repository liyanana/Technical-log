> 在安装一个 package，而此 package 要打包到生产环境 bundle 中时，你应该使用 npm install --save。如果你在安装一个用于开发环境的 package 时（例如，linter, 测试库等），你应该使用 npm install --save-dev。更多信息请查看 npm 文档。

> 可以这样说，执行 npx webpack，会将我们的脚本 src/index.js 作为 入口起点，也会生成 dist/main.js 作为 输出。Node 8.2/npm 5.2.0 以上版本提供的 npx 命令，可以运行在初次安装的 webpack package 中的 webpack 二进制文件（即 ./node_modules/.bin/webpack）

> ES2015 中的 import 和 export 语句已经标准化，但是目前大多数浏览器还无法支持它们，webpack 在幕后会将代码转译以便旧版本浏览器执行

> 放在 head 和放在 body 中的区别
> 在 HTML body 部分中的 JavaScripts 会在页面加载的时候被执行。
> 在 HTML head 部分中的 JavaScripts 会在被调用的时候才执行。

> 观察模式 watch:实时打包编译代码但是 html 不会更新；webpack-dev-server：实时重新加载

> webpack-dev-server 会从 output.path 中定义的目录为服务提供 bundle 文件，即，文件将可以通过 http://[devServer.host]:[devServer.port]/[output.publicPath]/[output.filename] 进行访问。

---

> webpack-dev-server 更新时，index.js 不更新，printjs 更新；但是如果入口文件制改为 index.js 的话，就都可以更新？emmmm

> tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)。它依赖于 ES2015 模块系统中的静态结构特性，例如 import 和 export。这个术语和概念实际上是兴起于 ES2015 模块打包工具 rollup。

> 开发环境(development)和生产环境(production)的构建目标差异很大。在开发环境中，我们需要具有强大的、具有实时重新加载(live reloading)或热模块替换(hot module replacement)能力的 source map 和 localhost server。而在生产环境中，我们的目标则转向于关注更小的 bundle，更轻量的 source map，以及更优化的资源，以改善加载时间。由于要遵循逻辑分离，我们通常建议为每个环境编写彼此独立的 webpack 配置。

> webpack4 以上的版本不再使用“extract-text-webpack-plugin”，应该改成用“mini-css-extract-plugin”

> 动态导入 什么时候会用到动态导入？？在文件顶部导入所有模块时，所有模块都会在文件的其余部分之前加载。在某些情况下，我们只需要根据某个条件导入一个模块。通过动态导入，我们可以按需导入模块。

### 代码分离的方式

- 入口起点：使用 entry 配置手动地分离代码。
- 防止重复：使用 Entry dependencies 或者 SplitChunksPlugin 去重和分离 chunk。
- 动态导入：通过模块的内联函数调用来分离代码。

### 预获取/预加载模块

- prefetch(预获取)：将来某些导航下可能需要的资源
- preload(预加载)：当前导航下可能需要资源
- 只要父 chunk 完成加载，webpack 就会添加 prefetch hint(预取提示)。

与 prefetch 指令相比，preload 指令有许多不同之处：

1. preload chunk 会在父 chunk 加载时，以并行方式开始加载。prefetch chunk 会在父 chunk 加载结束后开始加 2 载。
2. preload chunk 具有中等优先级，并立即下载。prefetch chunk 在浏览器闲置时下载。
3. preload chunk 会在父 chunk 中立即请求，用于当下时刻。prefetch chunk 会用于未来的某个时刻。
   浏览器支持程度不同。

### webpack 中，module，chunk 和 bundle 的区别是什么？

> 简而言之 module，chunk 和 bundle 其实就是同一份逻辑代码在不同转换场景下的取了三个名字：我们直接写出来的是 module，webpack 处理时是 chunk，最后生成浏览器可以直接运行的 bundle。

> peerDependency 的作用： peerDependency 就可以避免类似的核心依赖库被重复下载的问题。

> webpack 5 之前用 raw-loader，url-loader，file-loader 各种 loader，

- asset/resource 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现。
- asset/inline 导出一个资源的 data URI。之前通过使用 url-loader 实现。
- asset/source 导出资源的源代码。之前通过使用 raw-loader 实现。
- asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现。
