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