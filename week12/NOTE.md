学习笔记


## 组件

### 对象
- Properties
- Methods
- Inherit

### 组件
与ui强相关，是一个特殊的**对象**或特殊的**模块**  
- Properties
- Methods
- Inherit
- Attribute(特性)
- Config & State
- Event
- Lifecycle
- Children(为了形成树形结构)

#### Attribute
- 强调描述
- 最初是html中的attribute的概念

#### Property
- 强调从属关系
- 最初面向对象的概念

```
Attribute:
<my-component attribute="v" />
myComponent.getAttribute("a")
myComponent.setAttribute("a", "value")

Property:
myComponent.a = "value"
```

- 早期关键字不能做属性名，所以出现了`div.className`表示class

- Attribute是个字符串，property是个语义化后的对象，比如：`div.style`可以得到一个k-v结构的数据

- `href`的property是一个经过resovle过的url：
  比如设置a.setAttribute('href') = '//m.taobao.com'  
  a.href = 'http://m.taobao.com'  

- input的value:  
attribute相当于默认值  
property是实际的值

#### 生命周期
- created
- mount
  - mount
  - unmount 
- JS change / set
- User Input
  - render /update
- destoryed

#### Children
- content型
- Template型

------

## 组件系统
- react - JSX
- Vue - markup

### 建立jsx环境
```
mkdir jsx
cd jsx
npm init
npm intall -g webpack webpack-cli
npm install --save-dev webpack babel-loader

touch webpack.config.js
vim webpack.config.js
>>>
  module.exports = {
    entry: './main.js',
  }
<<<

touch main.js
vim main.js
>>>
  for(let i of [1, 2, 3]) {
    console.log(i)
  }
<<<

webpack

npm install --save-dev @babel/core @babel/preset-env

vim webpack.config.js
>>>
  module.exports = {
    entry: './main.js',
    module: {
      rules: [
        {
          test: '/\.js$/',
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    },
    mode: 'development'
  }
<<<

webpack

vim main.js
>>>
  for(let i of [1, 2, 3]) {
    console.log(i)
  }

  let a = <div/>
<<<

webpack
# 报错

npm install --save-dev @babel/plugin-transform-react-jsx

vim webpack.config.js
>>>
  module.exports = {
    entry: './main.js',
    module: {
      rules: [
        {
          test: '/\.js$/',
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-transform-react-jsx']
            }
          }
        }
      ]
    },
    mode: 'development'
  }
<<<

webpack
# 成功
```

> JSX相当于代码的一种表达方式
> JSX相当于语法糖，但是因为改变了代码结构，所以也不认为是一种语法糖
```
# 改变配置 改写 createElement
plugins: [['@babel/plugin-transform-react-jsx', ]]


```