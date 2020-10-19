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
