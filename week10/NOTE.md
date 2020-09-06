学习笔记

## 使用LL算法构建AST | 四则运算

构建AST语法树的过程被称为**语法分析**

**LL算法**从左向右*扫描*从左向右*规约*，即Left-Left

### 四则运算

#### 词法定义
- TokenNumber:  
  `0` \~ `9` 的组合，加 `.`
- Operator:   
  `+`、 `-`、 `*`、 `/`
- Whitespace:  
  `<SP>`
- LineTerminator:  
  `<LF>` `<CR>`

#### 语法定义
```
<Expression>::=
  <AdditiveExpression><EOF>

<AdditiveExpression>::=
  <MultiplicativeExpression>|
  <AdditiveExpression><+><MultiplicativeExpression>|
  <AdditiveExpression><-><MultiplicativeExpression>

<MultiplicativeExpression>::=
  <Number>|
  <MultiplicativeExpression><*><Number>|
  <MultiplicativeExpression></><Number
```
从下向上定义，先定义乘除，再定义加减，表示优先级  
`<EOF>`表示终结  

&emsp;
解析语法时，需要逐级展开，如：
```
<AdditiveExpression>::=
  <MultiplicativeExpression>|
  <AdditiveExpression><+><MultiplicativeExpression>|
  <AdditiveExpression><-><MultiplicativeExpression>
```
解析时展开**<MultiplicativeExpression>**为
```
<AdditiveExpression>::=
  <Number>|
  <MultiplicativeExpression><*><Number>|
  <MultiplicativeExpression></><Number|
  <AdditiveExpression><+><MultiplicativeExpression>|
  <AdditiveExpression><-><MultiplicativeExpression>
```
即判断是否使用加法还是乘法表达式，需要看第二个输入的终结符

------

## 词法分析的做法

### 正则
```
var regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g;
```
`()`中的内容会被直接匹配出来  
用`|`分隔开来，也就是说每次会匹配其中的一种  
```
var dictionary = ['Number', 'Whitespace', 'LineTerminator', '*', '/', '+', '-'];
```
每一个取出的字符串段叫做一个`token`，需要不断的去执行取出所有`token`
```
function tokenize(source) {
  var result = null;
  while(true) {
    result = regexp.exec(source);
    if (!result) break;
    for (var i = 1; i <= dictionary.length; i++) {
      if (result[i]) {
        console.log(dictionary[i - 1]);
      }
    }
    console.log(result);
  }
}

tokenize('1024 + 10 * 25');
```

------

解决意外的情况，手动比对lastIndex和每次match的字符长度  
改为generator形式  
添加最终处理`EOF`的代码  
见[003_tokenize.js](003_tokenize.js)

------

完成MultiplicativeExpression，测试  
见[004_expression.js](004_expression.js)  
此时生成的即为简单的AST

------

完成AdditiveExpression  
需要注意：AdditiveExpression的第三项，是含有非终结符`MultiplicativeExpress`的，需要代码运行过`+`、`-`操作符时，先处理下这个非终结符  

然后完成Expression，处理下`EOF`  

基本的LL语法分析完成

------

## 字符串分析算法
从简单到困难，大概分为：  
- 字典树  
  大量高重复字符串的存储与分析  
  匹配两个字符串完全相等  

- KMP  
  在长字符串里找模式  
  即在一个字符串中去找一个子字符串  
  复杂度`m + n`

- Wildcard  
  带通配符的字符串模式  
  可理解为弱正则  
  \?代表任意字符  
  \*代表任意字符、任意长度
  复杂度`O(m + n)`  
  有一个贪心算法  

- 正则  
  字符串通用模式匹配  
  字符串匹配的终极版本  
  利用到回溯原理  

- 状态机  
  通用字符串分析  
  功能和正则一致，但是可以用代码做额外处理  
  成本比正则高  

- LL LR  
  字符串多层级结构分析  
  处理html的stack的算法，是简化版的LR算法LR(0)  
  一般处理用LR(1)，可以等价LL的算法  

------

## 字典树
哈希树的一种特例  
依次扫描并生成节点数，match的时候也是依次match
见[007_Trie.js](007_Trie.js)  

------

## KMP
名字来自三位科学家  
比暴力破解要节省时间复杂度  
暴力： `m * n`  
KMP： `m + n`  
```
a b c d a b c e      a b a b a b c
0 0 0 0 0 1 2 3      0 0 0 1 2 3 4
      ^       │        ^         │
      └───────┘        └─────────┘

a a b a a a c
0 0 1 0 1 2 2
  ^ a 无重复
    ^ 这里的1是因为a前边出现了相同的a，记1次
      ^ 因为上一步断掉了，重新记相同字符串，a，记0次
        ^ aa时，a在之前重复出现了1次
          ^ aaa，a在之前重复出现了2次
            ^ aaac看起来好像是要断掉字符串重新开始记，但是之前出现了aab，这里aaac可以与之前的aab的前两位aa匹配，所以记2

发现不匹配，回退n
n为当前位之前出现重复字符的计数
```
见[008_KMP.js](008_KMP.js)  

------

## Wildcard
由`*`和`?`和字符串组成  
最后一个`*`不一样  
去掉问号，就是一个多组的kmp算法  

见[009_Wildcard.js](009_Wildcard.js)  

