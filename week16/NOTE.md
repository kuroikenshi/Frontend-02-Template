学习笔记

# 制作工具链

## 脚手架
generator称作脚手架，与工具链不是同一概念

### Yeoman 创建脚手架用的工具

#### 安装
```
mkdir toolchain
cd toolchain
npm init
npm install yeoman-generator
```

#### 创建目录结构
```
├─package.json
└─generators/
  ├─app/
  │ └─index.js
  └─router/  <-- 用于创建复杂工具链，暂时可不创建
    └─index.js
```

#### 写generators/app/index.js
```
var Generator = require('yeoman-generator');

module.exports = class extends Generator {
   // The name `constructor` is important here
   constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

  }

  method1() {
    this.log('method 1 just ran');
  }

  method2() {
    this.log('method 2 just ran');
  }
};
```
**需要注意，yeoman的api比较奇怪，会顺序执行类中定义的方法。**

#### 修改入口
修改package.js中的main指向`generators/app/index.js`

#### npm link
`npm link`会将当前模块link到一个标准模块中去  
会将全局的toolchain指向当前开发中的模块  
**需要注意的是package.js中的name必须是以“generator-”开头的**，否则yeoman无法运行
```
D:\ws\Frontend-02-Template\week16\toolchain>npm link
npm WARN toolchain@1.0.0 No description
npm WARN toolchain@1.0.0 No repository field.

audited 409 packages in 8.011s
found 0 vulnerabilities

C:\Users\Kidou\AppData\Roaming\npm\node_modules\generator-toolchain -> D:\ws\Frontend-02-Template\week16\toolchain
```

#### 全局安装yeoman
```
npm install -g yo
```

#### 运行
```
yo toolchain
```

**需要注意的是，可以给method前增加async来支持异步**

### yo 交互
使用`prompt`方法，来于用户进行交互
```
async method1() {
  const answers = await this.prompt([
    {
      type: "input",
      name: "name",
      message: "Your project name",
      default: this.appname // Default to current folder name
    },
    {
      type: "confirm",
      name: "cool",
      message: "Would you like to enable the Cool feature?"
    }
  ]);

  this.log("app name", answers.name);
  this.log("cool feature", answers.cool);
}
```
运行效果:
```
D:\ws\Frontend-02-Template\week16\toolchain>yo toolchain
? Your project name demo
? Would you like to enable the Cool feature? No
app name demo
cool feature false
```

### yo 文件系统
在`generators/app/`下创建`templates/`路径，并创建`t.html`模板文件  
内容为：  
```
<html>
  <head>
    <title><%= title %></title>
  </head>
</html>
```
`index.js`中方法修改:
```
async step1() {
  this.fs.copyTpl(
    this.templatePath('t.html'),
    this.destinationPath('public/index.html'),
    { title: 'Templating with Yeoman' }
  );
}
```
之后再一个新建的文件夹中，比如`demo/`中，打开命令行，运行：
```
D:\ws\Frontend-02-Template\week16\demo>yo toolchain
   create public\index.html
```
提示创建了一个新文件`public\index.html`即为，使用模板 + 数据填充后生成的页面

### yo的依赖
对npm进行了包装  

使用`this.npmInstall(['lodash'], {'save-dev': true });`来安装和使用npm  
等同于`npm install lodash --save-dev`  

`index.js`中增加方法:  
```
initPackage() {
  const pkgJson = {
    devDependencies: {
      eslint: '^3.15.0'
    },
    dependencies: {
      react: '^16.2.0'
    }
  };

  // Extend or create package.json file in destination path
  this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);

  this.npmInstall();
}
```
还是在`demo/`中运行：
```
D:\ws\Frontend-02-Template\week16\demo>yo toolchain
   create package.json
   create public\index.html
npm WARN deprecated circular-json@0.3.3: CircularJSON is in maintenance only, flatted is its successor.
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN demo No description
npm WARN demo No repository field.
npm WARN demo No license field.

added 144 packages from 156 contributors and audited 144 packages in 29.509s

3 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```
由此可见，npm install被正确执行  


## build工具

### webpack
设计上是为了将node的代码转化成浏览器使用的js  
核心思路：打包成js，然后html去引用这个js

#### 能力
- 多文件合并
  - 通过loader和plugin去控规则

#### 安装
全局安装：
```
npm install -g webpack-cli webpack
```
项目中安装：
```
npm install --save-dev webpack-cli
```
推荐使用`npx`，不会发生二次安装的情况
```
npx webpack
```
在本地已经安装的情况下，会直接执行

#### Loader
webpack的灵魂，在`module.rules`中定义  

loader把一个 `source` 变成一个`目标代码`，可以认为loader是一个纯粹的文本转换

## Babel工具
把新版js变异成老版本js

### 使用babel脚本工具

#### 安装
```
npm install -g @babel/core @babel/cli
```

#### 编译
```
babel ./src/sample.js > 1.txt
```
发现并没有什么变化，因为没有配置

#### 配置
使用babel的路径下，创建`.babelrc`文件，JSON格式
```
{
  "presets": ["@babel/preset-env"]
}
```
常用的配置，保存成了`presets`，即预设  
使用时需要提前安装，如
```
npm install --save-dev @babel/preset-env
```

通常使用方式为在webpack中配置"babel-loader"
