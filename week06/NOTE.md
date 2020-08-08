学习笔记

# CSS规则
- @ Rules
- Rules

# @ Rules

> 不是标准，没有完全被统一

## @rules分为以下常用几种(并不完整)：
- @charset         指定编码
- @import          引入其他css文件
- @media           媒体查询（最常用）
- @page            ？？？
- @counter-style   ？？？
- @keyframes       动画关键帧定义（最常用）
- @fontface        定义字体（最常用）
- @support         css属性支持检查（鸡肋）
- @namespace       （极端情况下，作为补充使用）

## 已经成为历史或尚在讨论中的@rules
- @document
- @color-profile
- @font-feature

# CSS规则

- 选择器
- 声明
  - Key
  - Value

```
div {
  background-color: #ff0000;
}
```
其中：
- div为选择器
- 大括号里每一行为一条声明
- 每一个声明冒号前为key
- 每一个声明冒号后为value


- Selector
  - Level3  
    浏览器已经实现、支持的比较好的
  - Level4  
    标准制定途中

- Key
  - Property  属性
  - Variables 变量（以双减号开始）

- Value
  - 值
  - 函数

## LEVEL3规则

- selector_groups  
  以逗号分隔的selector组成的

- selector  
  用combinator(连接器)连接simple_selector_sequnece(简单选择器序列)组成的

- combinator  
  - +S\* (后边跟任意空格)
  - >S\*
  - ~ S\*
  - S+(至少一个空格)

- simple_selector_sequence
  - type_selector(类型选择器，什么都不带的) | universal(\*，代表任意类型）  
    可以有，可以没有  
    先出现

  - HASH(#) | class | attrib([]) | pseudo(: | ::) | negation(:not())  
    可以有，可以没有  
    出现在中间  

  - HASH | class | attrib | pseudo | negation  
    至少有一个  
    出现在末尾  

## LEVEL4规则
  增加许多伪类选择器，negation更强大  
  不展开讲

## KEY - variable
定义
```
:root {
  --main-color: #06C;
  --accent-color: #006;
}
```

在子元素中使用variable
```
#foo h1 {
  color: var(--main-color);
}
```

可以跟任何函数进行嵌套，比如`calc(var(--two) + 20px)`  

可以给默认值，比如`color: var(--text-color, black);`  

除了用作value还可用作key，如:  
```
.foo {
  --side: margin-top;
  var(--side): 20px;
}
```

用变量可以覆盖之前的赋值，但是会出现无效值的情况，如：
```
：root { --not-a-color: 20px; }
p { background-color: red; }
p { background-color: var(--not-a-color); }
```
最后p会变成透明  

## VALUE - property

> 基于leve4标准，虽然是进行中的标准，但是状态非常好
参照[https://www.w3.org/TR/css-values-4/](https://www.w3.org/TR/css-values-4/)

长度单位有许多，绝对单位基本只用**px**

函数：
- calc
- attr
- min
- max
- clamp

# 收集标准

准备脚本
