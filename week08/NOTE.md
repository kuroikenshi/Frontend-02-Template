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

---

