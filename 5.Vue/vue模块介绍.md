### 一. 组件化开发

#### 1.1. 父子组件的访问

* children/refs
* parent/root



#### 1.2. slot的使用

* 基本使用
* 具名插槽
* 编译的作用域  变量只在当前的作用域起作用 
* 作用域插槽



### 二. 前端模块化

#### 2.1. 为什么要使用模块化

* 简单写js代码带来的问题
* 闭包引起代码不可复用
* 自己实现了简单的模块化
* AMD/CMD/CommonJS 这几种都是模块规范化的标准 
* 模块化开发思想 export default  import 这样就不用在<script src='.js'>引入了

#### 2.2. ES6中模块化的使用

* export 有多种方式 
* import



### 三. webpack

#### 3.1. 什么是webpack

```
有没有用webpack搭配过项目框架
	下载webpack node.js npm 
	新建目录 dist src/main.js index.html 
	
	处理模块间的各种依赖，并将其进行整合打包
打包：将各种资源模块进行打包合并成一个或多个包Bundle，并且还可以将资源进行处理 
grunt/gulp也是打包工具
```



* webpack和gulp对比

  ```
  gulp是啥，两者有什么不同
  ```

  

* webpack依赖环境  node 

* 安装webpack

  ```
  查看node版本： node -v 
  安装全局webpack：cnpm i webpack -g 
  查看webpack版本： webpack --version webpack-cli 4.2.0 webpack 5.6.0
  
注意：新版的vue-cli3将webpack的相关配置隐藏起来了，所以最好下载指定版本的webpack3.6.0 
    cnpm i webpack@3.6.0 -g
  
  全局安装后，还需要进行局部安装
  ```
  
  webpack运行，依赖于node环境。而node环境为了正常运行，也需要包含各种依赖的包
  
  npm工具就是用来管理这些包

#### 3.2. webpack的起步

* webpack命令

  ```
  (npx) webpack ./src/main.js -o ./dist/bundle.js --mode development
  webpack本身就是一个打包命令 通过config.js 配置文件配置后，用npm来执行脚本进行打包 
  多生成了一个bundle.js/main.js 这是为什么？回退到3.6.0版本后恢复正常
  ```

* webpack配置：webpack.config.js/package.json(scripts)

  ```
  
  404错误 index.html文件放错了位置 一直没看出来
  
  common.js模块化规范 const . = require('./..')
  es6 import..from 
  
  webpack.config.js配置好后，执行webpack报错  path需要传入绝对路径 
  需要下载path包，直接配置相关环境，npm init 多了一个package.json文件
  npm install 会下载package.json里依赖的相关包 生成了一个package-lock.json文件
  
  现在执行webpack 就可以打包了 
  
  npm run .. 就是去package.json里找scripts里的命令
  
  
  本地安装的模块就是为了与项目保持同步的 cnpm i webpack@3.6.0 --save -dev
  开发阶段用的一些插件，打包之后就没用了
  
  安装css-loader依赖  npm install --save-dev css-loader@2.0.2 注意版本要跟视频一致 
  	负责将css文件进行加载
  安装style-loader依赖  npm install style-loader@0.23.1 --save-dev 负责将样式添加到DOM上
  安装less-loader npm install --save-dev less-loader@4.1.0 less@3.9.0 不确定这个需不需要跟版本对应 反正用的都是视频对应的版本 以后做项目自己更新吧 
  
  
  导入图片 
  安装引入依赖  npm install --save-dev url-loader@1.1.2  注意导入的图片太大了也会报错 无法解析 当加载的图片小于limit时，会将图片编译成base64字符串形式 
  如果图片过大，需要导入file-loader   npm install --save-dev file-loader@3.0.1
  	此时需要配置在webpack.config.js中配置 publicPath: 'dist/'，否则找不到路径 
  	在实际打包时，需要将所有图片放在同一个文件夹中，保持原来的名字又不能重复， img/name.hash8名字加上八位哈希值  ext以前的后缀名
  	在options里进行配置 img/[name].[hash:8].[ext]
  ```

  

#### 3.3. webpack的loader

* css-loader/style-loader

* less-loader/less

* url-loader/file-loader

* babel-loader

* vue-loader 

  ```
  将es6转换成es5 npm install --save-dev babel-loader@7 babel-core babel-preset-es2015
  	options: { presets: ['es2015']} 这个值需要进行修改
  ```

  



#### 3.4. webpack中配置Vue

* vue-loader

  ```
  npm install vue --save 运行时也需要，不要后缀-dev 
  
  runtime-only
  runtime-compiler
  
  el与#app对应起来，template里的模板会将<div id="#app">替换掉   概念：模板字符串 
  
  这时候导入vue文件，webpack是无法识别打包的
  安装依赖vue-loader vue-template-compiler 
  	npm i vue-loader@13.0.0 vue-template-compiler@2.5.21 --save-dev .
  记住 安装完都是需要配置的，不然相当于没安装
  
  注意 vue vue-template-compiler版本要一直，否则会报错
  
  导入组件时不要省略.vue，想简写需要在webpack里进行配置 resolve"：{ extensions: ['.js', '.css', '.vue'] }
  
  使用脚手架不用管这些，可以简写 
  ```

  项目是在webpack的管理下一步步搭建出来的，由webpack进行管理，而不是npm，npm只是包管理工具，这些包通过它来下载，webpack管理项目时依赖于各种插件，下载后要在config.js里进行配置  

  ​	包括：css less es6 图片 vue 



#### 3.5. webpack的plugin

+ 定义

  ```
  plugin是插件的意思，对现有的架构进行扩展 
  使用：
  	1.通过npm进行安装（内置的插件不需要安装）
  	2.在webpack.config.js中配置插件   
  
  loader和plugin的区别
  	loader主要用于转换某些类型的模块，它是一个转换器
  	plugin是插件，对webpack本身的扩展，是一个扩展器
  ```

  

+ 示例

  ```
  1.BannerPlugin 添加版权信息 
  const webpack = require('webpack') BannerPlugin是webpack自带的插件，直接使用就行了 
  	plugins: [
          new webpack.BannerPlugin('最终版权归Hurst所有')
      ]
      
  2.HTMLWebpackPlugin 
  	作用：自动生成index.html（也可以指定模板），将打包的js文件自动通过script标签插入到body中 
  	安装：npm install html-webpack-plugin@3.2.0 --save-dev
  	使用：
  		1.导入 const HtmlWebpackPlugin = require('html-webpack-plugin')
  		2.配置 plugins: [ new HtmlWebpackPlugin({template: 'index.html'}) ]
  		3.删除index.html的script导入标签（避免重复）
  		4.删除config.js里的publicPath属性
  		
  3.uglifyjs-webpack-plugin 代码压缩，删除空格，简化变量名等 
  	安装：npm install uglifyjs-webpack-plugin@1.1.1 --save-dev
  ```


#### 3.6. 搭建本地服务器

* webpack-dev-server

* 作用：每次更新代码后都需要打包再运行，运行的是打包后的相关代码，开发效率不高

* 在本地搭建一个服务器，不用打包就可以显示网页了。这个服务器基于node+express，是在内存中运行的，所以效率很高，可以实时监听变化。打包后的文件是丢在磁盘中的。

* ```
  	安装：npm install webpack-dev-server@2.9.3 --save-dev
    	运行: webpack-dev-server 是报错的，注册表中没有这个命令，它是本地安装的  可以进入node.modules/bin 执行
    	优点：修改代码保存后，浏览器会自动刷新 
    	
    	增加scripts "dev":"webpack-dev-server --open(自动打开网页，可用可不用)"
  ```


#### 3.7. 配置文件的分离

+ 有些是开发阶段用的 有些是打包时用的  需要将这些配置文件分离 

  ```
  安装：npm install webpack-merge@4.1.5 --save-dev
  新建文件夹：build/ 
  	base.config.js 修改output的路径
  	dev.config.js 
  	prod.config.js 进行分离
  修改package.js里的scripts 加上--config [path],指定语句执行的位置 
  ```

  


### 四. Vue CLI

#### 4.1. 什么是CLI

* 脚手架是什么东西.

  ```
  CLI：command-line interface，命令行页面，俗称脚手架
  	官方发布的vue.js项目脚手架
  	使用vue-cli可以快速搭建Vue开发环境及对应的webpack配置 
  	大型应用需要考虑目录结构、热加载、代码单元测试等功能
  ```


#### 4.2. CLI2初始化项目的过程

+ 初始化

  ```
  npm：node package manager,包管理工具 
  CLI依赖webpack,node,npm
  安装：npm install @vue/cli -g 安装脚手架3/4，可以在这个基础上拉取2
  拉取2.x版本：npm install -g @vue/cli-init
  查看：vue -V >> @vue/cli 4.5.4 
  初始化项目： 
  	vue init webpack project_name  --vue cli2初始化项目
  	vue create project_name --vue cli3/4初始化项目  
  	
  Eslint 是否对js代码进行限制（检查），如果不规范就会报错，比如说空格有问题 。暂时选择false，根据自己的习惯来就行了
  unit tests no 都选no就行了 
  e2e tests
  ```


#### 4.3. CLI2生产的目录结构的解析

```
目录结构 
	> build
	> config 这两个文件夹都是webpack的相关配置
	> node_modules 依赖的node相关模块 
	> src 开发的主要目录
	> static 静态资源，会全部复制到dist文件夹中，src也有相关的文件夹
	> .babelrc babel将es6转成es5 
	> .editorconfig 对编码风格进行统一
	> .eslintignore 忽略指定文件下代码不规范的地方
	> .gitignore 忽略指定上传文件
	> index.html 主页面
	> package.json 记录安装的版本 ^ ~指定的版本不严格
	> package-lock.json 记录node_module里真实安装版本的映射
```

接下来要学习的内容 

```
runtime only 
runtime compiler  
vue-router 
vuex 
axios  
```

### 五.vue-router

#### 5.1 定义

#### 5.2 导航钩子 

### 六.Vuex

#### 6.1 介绍  

+ **vuex**是什么

  ```
  	- 通过状态（数据源）集中管理驱动组件的变化（好比 spring 的 IOC 容器对 bean 进行集中管理）。 
  	- 应用级的状态集中放在 store 中； 改变状态的方式是提交 mutations，这是个同步的事物； 异步逻辑 应该封装在 action 中
  	- Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式
  	- 采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。
  	- 有五种属性，分别是state mutations action getters module 
  ```

#### 6.2 属性

+ state

  ```
  定义：
  	1.存放响应式的数据，数据发生变化时，依赖这个数据的组件也会发生更新
  	2.通过mapState把全局的state和getters映射到当前组件的computed计算属性中
  
  使用： 
  	state: {
  		value1,
  		value2
  	}
  
  在组件中获取vuex状态：在计算属性中返回状态
  	computed: {
  		count() { return this.$store.state.count }
  	}
  	
  也可以使用 mapState 来传入state里的数据，简化代码，类似于 mapGetters
  ```

+ getters

  ```
  	有时候我们需要的不是state里的原始数据，而是经过筛选或计算过的数据，可以将方法写在getters进行返回
  	getters： {
  		doneTodos: state => {
  			return state.todos.filter(todo=>todo.done)
  		}
  	}
  进阶用法：返回一个函数，来给getters传参
  	getters: {
  		getTodoById: (state) => (id) =>	{
  			return state.todos.find(todo => todo.id === id)
  		}
  	}
  	调用：this.$store.getters.getTodoById(2) 
  	这样还是有些复杂，直接将getter属性映射到局部的计算属性
  	import { mapGetters } from 'vuex'
  	computed: {
  		...mapGetters([
  			'doneTodosCount', // 如果想改变方法名字，传入对象来接收
        		'anotherGetter',
        		//....
  		])
  	}
  	
  ```

+ mutations

  ```
  特点：
  	- 更改Vuex中state的状态的唯一方法时提交mutation，类似于事件
  	- mutation必须是同步函数，这样才能调试工具对数据的状态进行跟踪
  
  使用：
  	// 定义mutation handler（事件回调函数）
  	mutations: {
  		increment(state){
  			state.count++
  		}
  	}
  	// 调用该函数
  	this.$store.commit('increment')
  	//进阶用法 携带参数payload(载荷)
  	..{increment(state, n) {state.count += n}}
  	this.$store.commit('increment', 10)
  ```

+ actions 

  ```
  特点：
  	- Action提交的是mutation，而不是直接变更状态
  	- Action可以包含异步操作 
  	
  使用：这里面的知识点很多，反复看，多琢磨
  	定义：将mutations丢在actions里，可以执行异步操作 
  	触发：this.$store.dispatch('increment')
  ```

  

+ module

  ```
  	-当应用比较复杂时，可以将store分割成模块，每个模块都有自己的state mutation action getter
  ```

  



#### 6.3 使用

+ 如何使用vuex
+ 如何对vuex的五种状态进行测试
+ 什么是热重载 代码发生改动时，页面会自动刷新



