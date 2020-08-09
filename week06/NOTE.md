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


# 选择器语法

## 简单选择器
- *
- div  
  注意namespace，比如svg中的a表示为：svg|a  
- .cls
- #id
- [attr=value]
- :hover
- ::before

## 复合选择器  
以此按照类型、class、id、伪类选择器并排出现的简单选择器

## 复杂选择器  
复合选择器之间使用`<sp>`、`>`、`~`、`+`、`||`连接的形式  
其中`||`为level4的选择器



# 选择器优先级

> 选择器优先级实际上是对一个复杂选择其中出现的所有简单选择器的计数
```
#id div.a#id  

[0,       2,   1,      1]  
inline    id   class   type  

S = 0 * N**3 + 2 * N**2 + 1 * N**1 + 1
取N = 1000000 <- 6个0
S = 200001000001
```
理论上N取得足够大即可  
> 老版本IE6上为了节省空间，使用N=256, 结果造成256个class等于1个id
> 之后大部分浏览器都选择了65536

参考文章 [https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity)  
摘抄其中一部分结论：  

下面列表中，选择器类型的优先级是递增的：  
- 类型选择器（例如，h1）和伪元素（例如，::before）  
- 类选择器 (例如，.example)，属性选择器（例如，[type="radio"]）和伪类（例如，:hover）  
- ID 选择器（例如，#example）  

对优先级**没有影响**的选择器类型：
- 通配选择符（universal selector）（\*）  
- 关系选择符（combinators）（+, >, ~, ' ', ||）  
- 否定伪类（negation pseudo-class）  

但是，**在 :not() 内部声明的选择器会影响优先级**

由上结论，完成*练习2*答案为：
```
// 请写出一下4种选择器的优先级
div#a.b .c[id=x]
[0, 1, 3, 1]

#a:not(#b)
[0, 2, 0, 0]

*.a
[0, 0, 1, 0]

div.a
[0, 0, 1, 1]
```


# 伪类

> 支持的非常早，但是浏览器差异很大

## 链接/行为
- :any-link  
  any-link匹配所有超链接  
- :link :visited  
  link是还没有访问的超链接  
  visited是已经访问过的超链接  
  **一旦使用了link或visited，就只能修改文字颜色了**处于安全考虑
- :hover
- :active
- :focus
- :target

## 树形结构
- :empty
- :nth-child()  
  比较复杂，even|odd|第几个  
- :nth-last-child()  
  从后往前数
- :first-child :last-child :only-child

> 不建议使用破坏回溯原则的选择器

## 逻辑型
- :not  
  当前唯一可用，里面只能写复合选择器
- :where :has  
  level4的，目前不可用  


# 伪元素
- ::before
- ::after  
  declaration中增加一个content  
  可以增加一个相当于正常的dom节点  
- ::first-line  
  第一行选择器  
- ::first-letter  
  用不存在的标签把一定代码括起来变得可操作  

**before**和**after**相当于：
```
<div>
<::before/>
content
<::after/>
</div>
```
**first-letter**相当于：
```
<div>
<::first-letter>c</::first-letter>ontent
</div>
```

first-line选择器只支持：
- font
- color
- background
- word-spacing
- letter-spacing
- text-decoration
- text-transform
- line-height

first-letter：
- first-line支持的
- float
- vertical-align
- 盒模型

> 思考题：  
> 为什么first-letter可以设置display: block，但是first-line就不行呢？ 

答：  
因为首字母无论怎么变，都是首字母，不会对阅读造成影响。但是首行设置了其他样式，可能会造成第一行的内容发生变化，造成歧义，所以对其进行了限制，我是这么认为的。



