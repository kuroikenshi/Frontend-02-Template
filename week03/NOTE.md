学习笔记

# 语法

新概念：中缀树、抽象语法树
```
TODO: 补全定义和举例说明
```

Javascript标准中，使用产生式来表达优先级

&emsp;

# Expressions 表达式

优先级使用序号排列:

1. Member，成员
  - a.b
  - a[b]
  - foo\`string\` -> 跟成员访问没有任何关系
  - super.b
  - super['b']
  - new.target
  - new Foo()

2. New
  - new Foo:
    
    相当于new Foo()，括号可以省略
    
    ```
    例：
    new a()() => (new a()) ()
    new new a() => new (new a())
    new new a => (new new) a
    ```

&emsp;

## Reference

运行时的一个设施，一种类型。标准中的类型，而不是语言中的

&emsp;

### Object和Key

一个Reference类型取出来的是一个Object和一个Key
完全进入了一个Member运算的前半部分和后半部分

&emsp;

### delete和assign

加法或减法运算，会吧Reference直接解引用，然后像普通变量一样使用

而delete和assign是使用对象的Reference类型

&emsp;

例如`a = {a: 1, b: 2}`中

`a.a + a.b => 3` 即将对象引用的值作为“变量”来使用

而 `delete a.a` 表示将a对象的a的“引用”删除，运行后 a => {b: 2}

这里就用到了Reference类型，{a: 1, b: 2}变为{b: 2}即为删除a的“引用”的效果。

```
TODO: assign是什么？
```

3. Call
  - foo()
  - super()
  - foo()['b']
  - foo().b
  - foo()\`abc\`
  
  调用使Member语法优先级变为跟Call一样，所以先执行foo()，在执行.b
  
4. 左手表达式

能放到等号左边的，就叫左手表达式

```
a.b = c 左手
a+b = c 右手 -> 不可以,js中没有这个语法
```

5. Update 自增自减
  - a ++
  - a --
  - -- a
  - ++ a

```
++a++
++(a++)
均不合法
```

6. Unary 单目运算符
  - delete a.b
  - void foot()
  - typeof a
  - + a
  - - a
  - ~ a
  - ! a
  - await a
    
    会对语法结构造成影响
    
7. 乘方(唯一一个右结合的运算符)
  - **
  
  ```
  3 ** 2 ** 3 => 3 ** (2 ** 3)
  ```

8. 乘除取余
  - \* \/ \%

9. 加减法
  - + -

10. Shift 位运算、移位运算
```
TODO: 学习位运算符
```

11. 关系比较
  - 对两边是不是数字有要求
  
    < \> <= \>=
    
  - 其他
  
    instanceof, in

12. 相等比较
 - ==
 - !=
 - ===
 - !==

13. 位运算 Bitwise
 - &
 - ^
 - |
```
TODO: 学习按位与、抑或、按位或
```

14. 逻辑运算
 - &&
 - ||
! 注意短路原则！！

15. Conditional 条件？运算符
 - ? :
  唯一一个三目运算符
  ! 也有断路原则，跟C不一样
 


&emsp;
# 类型转换

## Unboxing

> 定义：Object通过拆箱转换变成一个基本类型的过程

- ToPremitive
  
  参与计算的时候，会调用ToPremitive过程
  
  一个对象o，里边有三个方法会影响toPremitive的过程
  - valueOf     加法会优先调用valueOf
  - toString    当o作为属性名时，优先调用toString方法

  每个表达式、算式都有一定的类型转换机制
  
  > ==是个特殊情况，建议绕过

```
var x = {}
x[o] = 1
"x" + o => "x2" 

var o = {
  toString() { return "2" },
  valueOf() { return 1 },
  [Symbol.toPrimitive]() { return 3 }
}
```

- toString vs valueOf


## Boxing
Number、String、Boolean、Symbol => 包装类，构造器
直接调用返回值
new调用返回对象

```
Number的Class上定义了一个属性或者方法
直接1 .xxx去调用时，自动完成了装箱的过程
也就是说number -> Number，然后调用Number.xxx
```

> 这个过程往往诱导新人认为Number类和Number类型是一个东西，这是错误的

> 可通过typeof去区分是“包装后的对象”还是“包装前的值”


&emsp;
# 运行时概念，语句
## Completion Record

- [[type]]:
  - normal
  - break
  - continue
  - return
  - throw
- [[value]]:
  - 基本类型
- [[target]]:
  - label

  > 再语句前加个":", break和continue会与之发生交互

## 简单语句
- ExpressionStatement: 

  表达式语句，由表达式组成，真正驱动计算机去计算的语句

- EmptyStatement
  
  空语句，比如纯分号
  
- DebuggerStatement
  
  调试语句：debugger;
- ThrowStatement
  
  抛出异常语句
- ContinueStatement和BreakStatement
  
  表示循环语句的一些动作
- ReturnStatement
  
  一定再函数中用，会返回函数的运行结果

## 复合语句
- BlockStatement

  由一对花括号，中间语句列表组成。可以把所有需要单条语句的地方变成多条。
  
- IfStatement
- SwitchStatement

  条件语句，Switch性能和if一样，不推荐
  
- IterationStatement
  
  循环语句
  
- WithStatement

  通过with打开一个对象，节约代码空间，不推荐使用。
  
- LabelledStatement

  再语句前加label，相当于给语句起了个名字
  
  比如Iteration加上Labelled，配合上Break和Continue就产生意义了
  
- TryStatement
  
  三段式语句，其中try的花括号是由try语句来定义的，所以不能省略
  
## 注意
for(a; b; c)和for(a in b)是js存在就有的
for会产生独立let作用域
in关键字被for in占用，不允许使用
try里边return了，finally里的语句还是会执行，属于特殊例子


&emsp;
# 声明

- FunctionDeclaration声明
- Generator声明
- AsyncFunc
- AsyncGen
- Variable
- Class
- Lexical：const和let

function声明
占了4种:
  - function：函数声明
  - function *：产生器声明
  - async function：异步函数声明
  - async function *：异步产生器声明

Variable既有声明的作用，又有实际计算的能力

行为上Class和Lexical的比较统一，老的var和function又比较统一

## 行为
function 在后边声明，前边可以调用到
var 比较特殊，虽然在前边声明了，但是实际赋值并没有发生
详情见结构化
class、const、let在声明前去使用，会报错
推荐鼓励使用class、const、let声明

## 预处理（pre-process)
```
var a = 2;
void function(){
  a = 1;
  return;
  var a;
}();
console.log(a); => 2
```
预处理机制，会将所有var挑选出来，放到函数的作用域级别中。

```
var a = 2;
void function(){
  a = 1;
  return;
  const a;
}();
console.log(a); => 报错
```
所有语句都有预处理机制，区别是：const在声明前去调用，会触发报错

## 作用域
作用域链（ECMA3.0）可以忘记了
现在ECMA10(一般叫ECMA2019)，使用作用域概念
代码中：作用域就是变量从哪儿到哪儿发生作用。
var作用域是前后都有（由于预处理机制）
const就是在block中，花括号中
```
var a = 2;
void function(){
  a = 1;
  {
    const a;
  }
}();
console.log(a); => 不报错
```
如果比较反感const重复定义报错，可以常使用{}把代码分成小节

## 小节
- 语法

  简单语句：描述运算
  组合语句：控制语句执行顺序
  声明：声明作用域、变量等

- 运行时
  
  - ComplationRecord
    
    决定了语句继续？还是终结。
    也就是语句的完成状态。
  
  - Lexical新一代声明语句方式。


&emsp;
# JS结构化

## JS执行粒度（由大到小）
- 宏任务
- 微任务（Promise）
- 函数调用（Excution Context）
- 语句/声明（Completion Record）
- 表达式（Reference）
- 直接量/变量/this ...

## 宏任务、微任务

概念：

```
var x = 1;
var p = new Promise(resolve => resolve());
p.then(() => x = 3);
x = 2;
```
将以上代码塞给JavaScriptEngine，产生两个子任务（“微任务”），即MicroTask（Job）
```
x = 1
p = ...
x = 2
```
和
```
x = 3
```
进行执行的整个过程，称为MacroTask，即“宏任务”

## 事件循环(event loop，来自node)
get code -> execute -> wait -> get code


## 函数调用
```
import {foo} from "foo.js"
var i = 0;
console.log(i);
foo();
console.log(i);
i++;
--------------
function foo(){
  console.log(i);
}
export foo;
--------------
调用的i都是同一个i么？
```

### Stack栈式的调用
每一个stack中的内容被称为Execution Context Stack（执行上下文）
正在运行的叫：Running Execution Context
Execution Context:
- code evaluation state
- Function
- Script or Module
- Generator （每次运行generator时，隐藏的那个generator）
- Realm（所有使用的内置对象的领域或叫王国）
- LexicalEnvironment和VariableEnvironment（let、const、class和var定义的变量）

### Execution Context
#### ECMAScript Code Execution Context

- Code evaluation state

- Function

- Script or Module

- Realm

- LexicalEnvironment

  - this
  - new.target
  - super
  - 变量
 
- VariableEnvironment

  历史的遗留包袱，仅仅用于var声明
  
  多数情况下lex和var下变量是相同的
  
  用with来声明的变量，会穿过with声明到最外层的function block中
  

#### Generator Execution Contexts
基于ECMAScript Code的执行上下文，再加上：
- Generator


#### Environment Record
- Environment Records
  - Declarative Env Rcd
    - Function Env Rcd
    - Module Env Rcd
  - Global Env Rcd
  - Object Env Rcd
  
#### Function - Closure
每一个函数都是一个闭包
一个函数内部，可以访问到函数外部的Env Record
Env Record 形成一个链式的结构，旧版本叫Scope Chain，现在已经没有这个概念了

#### Realm
ES2018之后形成的标准
在一个JavaScriptEngine中，所有基础类型的原型，都是Realm中定义的。
有可能根据不同外部条件，会创建Realm

```
练习：使用蚂蚁前端G6数据可视化工具，显示所有Realm
```
