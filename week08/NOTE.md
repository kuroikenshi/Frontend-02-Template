学习笔记

# 重学HTML

## HTML与XML和SGML
发展历程: 
1. **SGML** (Standard Generalized Markup Language), 即 *标准通用标记语言*, 最早由 **IBM&reg;** 使用，用来描述数据的语言  
2. **XML** (Extensible Markup Language), 即 *可扩展标记语言* 作为 *SGML* 的一个流行的子集，与 *SGML* 一样使用DTD作为定义  
3. **W3C** 之后对 *XML* 进行HTML化的尝试，出现了 **XHTML**   
4. 之后出现了**XHTML2**，由于语法过于严苛，导致社区不能接受，最终流产  
5. 最后 **HTML5** 进行了重新定义与 **XML** 和 **SGML** 的关系，最终生成了HTML5  

## DTD与XML namespace

**DTD(Document Type Definition)** 是 **SGML** 定义它子集的一种方式  

- [http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd](http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd)  (老版本的最新html1的DTD)
- [http://www.w3.org/1999/xhtml](http://www.w3.org/1999/xhtml)  (*XML* namespace)

> 任何人在实现浏览器的时候，不允许访问这个dtd的链接  

### DTD

HTML最早设计出来时*SGML*的一个子集  
XHTML1.0对应HTML4.2的版本  

**DTD** 中描述了元素出现位置和嵌套关系，属性、事件等关键字的定义。

**DTD** 中比较重要的为 **实体(Entity)定义** ，引用自3个文件，分别定义了拉丁字符、符号、特殊字符  
用`&`符开始的转义字符

转义字符中比较重要的: 
- **&amp;nbsp;**  
即No-break-space，是一个不会被合并和换行的空格，破坏语义，不推荐使用。

- **&amp;amp;**  
即`&`符本身

- **&amp;lt;**  
即Less-than，小于号`<`

> HTML5不再认为自己是SGML的子集，所以也就没有DTD这个定义了  
> 所以以DTD去了解HTML也就到此为止了

### XML namespace
> **URL** 对于namespace来说是可有可无的一种设施

每一个namespace的url都代表了唯一的一种语言  

HTML中包含的namespace有:  
- HTML
- XHTML
- MathML
- SVG

HTML5中会把HTML和XHTML写法作为两种不同的语法供使用者选择，所以HTML5中没有这两种的区分了  
所以无论HTML5.1还是5.2中，就只有XML的namespace了

------

## HTML语义化
> HTML是一个语义系统，所以不关心表现对不对，优先关心语义是否正确  
> 标签不够或者并不了解某个标签的语义的时候，用基本标签+class来表示，如：注释用`<p class="note"></p>`

页面代码语义化的好坏直接影响到 **`SEO优化`** 的效果

### 常用语义化标签
- aside  
  主要内容无关的，一般是工具、菜单之类的，可以存在多个  

- main  
  主要内容，仅允许出现一次  

- article  
  文章

- hgroup  
  标题组，包含h1\~h6    

- abbr
  缩写，使用`title`属性描述下缩写内容，如：  
  `<abbr title="World Wide Web">WWW</abbr>`  
  显示为：<abbr title="World Wide Web">WWW</abbr>  

- hr
  横线，语义上是break的意思

- p  
  文本段落  

- em
  表现为加粗，语义为一句话当中的重音，要强调的事儿

- strong  
  表现为加粗，不改变语义，只表示当前这个词很重要  

- figure  
  标签组，用来组合img和figcaption

- img  
  图片  

- figcaption  
  图片的描述，图表的标注等  

- ul、ol、li  
  无序、有序、单位项，注意无序和有序的语义项  

  > 目录上想用2.1、2.2这类文字，应该用ul还是ol呢？  
  > 还是应该用ol，用css去调整显示的内容

- nav  
  表示导航性质的内容

- div  
  块级内容  

- **dfn**  
  表示概念的定义，比如`<dfn>World Wide Web</dfn>表示xxx`  
  显示为：<dfn>World Wide Web</dfn>表示xxx  

- samp  
  表示举例，例子，可以扩pre  

- pre  
  表示预先调整好的文本，内容还是会被转义，还是需要处理`<`等符号

- code  
  是预先定义的文本，但是是代码，在pre中再加一层code

- footer  
  表示底部，表示body的底部，不一定非得放footer中，article中也可以有footer和header  

### 层级结构
```
html
 ├──head
 │   └──title
 └──body
     ├──aside
     │   └──nav
     │       └──ul、ol
     │           └──li (*n)
     ├──main (也可以不加main)
     │   └──article
     │       ├──hgroup
     │       │   └──h1~h6
     │       ├──p.note
     │       │   ├──abbr
     │       │   └──strong
     │       ├──p
     │       │   ├──abbr
     │       │   └──strong
     │       ├──figure
     │       │   ├──img
     │       │   └──figcaption
     │       ├──div、nav
     │       │   └──ul、ol
     │       │       └──li (*n)
     │       │
     │       ├──h1~h6
     │       ├──p
     │       │   └──dfn
     │       └──samp
     │           └──pre
     │               └──code
     └──footer
```

按照以上层级和标签语义，可以很清晰的了解当前页面每一块儿是什么内容，怎么组合到一起的，这就是语义化

> 疑问：header一般什么时候用？跟h1\~h6是怎么样的关系？

扩展阅读: [HTML标签嵌套规则](https://www.softwhy.com/article-33-1.html)

------

## HTML语法  

### 合法元素  
- Element: `<tagname>...</tagname>`  
- Text: `text`  
- Comment: `<!-- comments -->`  
- DocumentType: `<!Doctype html>`  
- ProcessingInstruction: `<?a 1?>`  
  预处理节点  
  供其他程序去预处理的特殊节点  
  结构上是由一个 **处理器名字** 跟一个 **不知道是什么的数据**，以一个 **空格** 分割  
  理论上讲 `a 1` 就是把 `1` 传给 `a`  
  但是线上不应出现带问号的语法……  
  设计的不是很成功，没人用……  
  所有预处理都是自己发明一套符号去处理  
- CDATA: `<![CDATA[]]>`  
  其实只是一种特殊的语法  
  产生的也是文本节点  
  文本不需要考虑转义问题  
  特性继承自 **XML** 

### 字符引用语法
- `&#161;` 即 `&#{数字};`  
  引用ASCII码为161的字符  
- `&amp;`
- `&lt;`
- `&quot;`

> 在 **html5** 中没有加字符引用的实体，已经基本够用了

------

# 浏览器API

> 重要性角度讲，7、80%都是DOM API，其他的还有BOM API  

**BOM(Browser Object Model)** 浏览器对象模型  

> 听起来好像是包含DOM的一个词, 其实并不是，它只是很小的一组API  
> 最早也是浏览器私有的名称  
> 没有特别好的名字来指代所有浏览器的API  
> 这里我们称为Browser API  

## DOM API
DOM API分为4个系列  

- 其中一个系列是废的，traversal系列API  
  可以访问DOM树的所有节点的自动迭代工具，用了比不用还麻烦，不推荐  

- 节点API

- 事件API

- Range API  
  更精确操纵DOM树，效率更高，但是难以理解和使用  

**节点继承图**  
```
Node: 所有节点的基础类型
│
├───Element: 元素型节点，跟标签组对应，80%~90%Node都是Element
│   │
│   ├───HTMLElement
│   │   │
│   │   ├───HTMLAnchorElement -> <a>标签
│   │   ├───HTMLAppletElement
│   │   ├───HTMLAreaElement
│   │   ├───HTMLAudioElement
│   │   ├───HTMLBaseElement
│   │   ├───HTMLBodyElement
│   │   └───……
│   │
│   └───SVGElement
│       │
│       ├───SVGAElement
│       ├───SVGAltGlyphElement
│       └───……
│
├───Document: 文档根节点
│
├───CharacterData: 字符数据
│   │
│   ├───Text: 文本节点
│   │   │
│   │   └───CDATASection: CDATA节点
│   │
│   ├───Comment: 注释
│   │
│   └───ProcessingInstruction: 处理信息
│
├───DocumentFragment: 文档片段
│
└───DocumentType: 文档类型
```

#### 导航类操作

分为 **节点的导航** 和 **元素的导航**  
因为代码中会出现很多回车、空格、tab等字符，所以会出现很多空的node，所以出现元素的导航

##### 节点的导航
- parentNode
- childNodes
- firstChild
- lastChild
- nextSibling
- previousSibling

##### 元素的导航
- parentElement
- children
- firsetElementChild
- lastElementChild
- nextElementSibling
- previousElementSibling

> parentElement和parentNode的功能是重复的……

#### 修改操作
- appendChild
- insertBefore
- removeChild
- replaceChild

`appendChild`和`insertBefore`为一组，可以满足所有空隙的操作，因为 *最小化原则* 所以就没有 ~`insertAfter`~  

按照 *最小化原则* ，其实`replaceChild`也是多余的，但是设计原则在历史上是不断变化的……谁知道是啥情况  

#### 高级操作
- compareDocumentPosition  
  用于比较两个节点关系的函数  
- contains  
  检查一个节点是否包含另一个节点的函数  
- isEqualNode  
  检查两个节点是否完全 **相同** (只要DOM树结构相同，即相同)  
- isSameNode  
  (废弃的，可能是出于多语言考虑……) 检查两个节点是否是 **同一节点** ，实际上在JavaScript中可以使用`===`  
- cloneNode  
  复制一个节点，如果传入参数`true`，则会连同子元素做深拷贝  

------

