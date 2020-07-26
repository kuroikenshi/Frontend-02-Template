学习笔记

# 浏览器工作原理

> 核心原理：URL -> BitMap图片

目标：ToyBrowser

## 浏览器基本流程

URL

    =HTTP=> 

HTML

    =parse=> 文本分析，生成

DOM

    =CSS-Computing=> 计算最终css结果

DOM-with-CSS

    =Layout=>   排版

DOM-with-position   获得定位的实际上是css生成的核，toy中不纠结这么多

    =render=>

Bitmap

# 有限状态机

通称：状态机。

- 每一个状态，都是一个机器，互相解耦。

    - 在有限状态机的每一个机器里，都可以做计算。

    - 在本机内可以完全忽略别人的状态。

    - 状态机本身不能有状态，如果用函数来表示，应该是纯函数，不能有副作用。

- 每一个机器都知道自己下一个状态是什么

    - 每一个机器都有确定的下一个状态（摩尔状态机Moore)

    - 每一个机器根据输入决定下一个状态（米粒型状态机Mealy）

        大多数比较实用，比较复杂，但是描述能力强

## 使用JS实现状态机

> 目标: 不使用正则和其他工具，只是用基本js语法，在str中找到'abcdef'

在这之前，自己尝试以下 *目标* ，即使用非状态机的方式实现下。  

对比实验 (参看winter的示例)
> winter示例大致思路就是轮询str -> c  
> 判断c当前步骤找到'a'，将foundA置为true，然后下一个循环  
> foundA的话，判断是否c === 'b'，是的话将foundB置为true，然后进行下一个循环  
> 以此类推，如果没找到，则所有found置为false，从新从a开始找  
> 基本就是写一堆if、else

使用状态机思路：**每找到一个，改变一个状态**  


```
function match(str) {
    let state = start;
    for(let c of str) {
        state = state(c);
    }
    return state === end;

    // ******************************
    // 以下每一个function，即一个状态机
    // ******************************
    function start(c) {
        if (c === "a") {
            return foundA;
        }
        else {
            return start;
        }
    }

    // 这里涉及一个小技巧：
    function end(c) {
        // 如果进入了end，就一直返回自身
        // 这个称为trap，把状态trap在最后的状态
        // 把状态控制在end里
        return end;
    }

    function foundA(c) {
        if (c === "b") {
            return foundB;
        }
        else {
            return start;
        }
    }

    // 以此类推...

    function foundE(c) {
        if (c === "f") {
            return end;
        }
        else {
            return start;
        }
    }

}

match('abcabdef');
```
运行时发现输出为false，为什么呢？  

因为：foundC中，检查下一个是不是`d`，当前字母为`a`，所以失败了  

失败之后，return的是start，那么下一个去检查`a`, 但是此时，`a`在上一步检查时被用掉了，怎么办呢？  

这里又涉及到一个小技巧: 把`a`还给上一步，为此我们需要修改：

    `return start;` => `return start(c);`

这样，检查当前`c === "d"`失败后，马上将`c`丢给下一步处理去做，以弥补丢失的一步  

这个行为在状态机里可以叫做 **reConsume** ，大概相当于 *重新使用* 这么一个逻辑

> 选作：字符串KMP算法自己调查一下，实现未定pattern的find方法


&emsp;
# HTTP请求

禁用require("http")，因为都帮你做了，咱们这里用require("net")

## TCP与IP

- 基于流，没有分割单位，只保证顺序是正确的
- 端口: 区分流到软件
- 传输数据包
- 通过ip地址找到应该从哪儿到哪儿

底层使用libnet和libpcap的c++的库
- libnet用来封包、解包等包处理，发送
- libpacp用来抓包  

## HTTP

区分与TCP协议的对等的关系，无所谓发送顺序  
HTTP必须由客户端发起一个请求，服务端回复响应  
是基于TCP封装的一种更高级的协议  

> http协议：是文本型协议，内容为字符串

### Request的结构：
- Request line:  
    为**一行**结构，由三部分组成，基本格式为：`{Method} {Path} HTTP/{HttpVersion}`  
    实例：`POST / HTTP/1.1`，其中：  
    - `Method`为请求类型，最常使用GET和POST类型，也有许多其他类型比如HEAD、DELETE之类  
    - `PATH`为本次请求的相对路径  
    - `HttpVersion`是当前应用HTTP的协议版本，`1.1`是一个比较老的版本，相关参数比较简单，以此举例  

- Headers:  
    为**多行结构**，每行以**冒号**分隔的一个键值对，行数不固定，以一个**空行**为结束符  
    实例：  
```
Host: 127.0.0.1
Content-Type: application/x-www-form-urlencoded  
(这里有空行)
```

- Body:
    结构由Headers中的Content-Type决定
    > 所有HTTP里边的换行，都是由`\r\n`这两个字符组成的

### Response的结构：
- Status Line:
    为**一行结构**，三部分组成，基本格式为：`HTTP/{HttpVersion} {StatusCode} {StatusMsg}`  
    实例：`HTTP/1.1 200 OK`  
    其中：  
    - `StatusCode`基本规律为：  
        `200`表示成功  
        `4xx`表示客户端错误  
        `5xx`表示服务端错误  

- Headers:
    格式跟Request的完全一致  
    实例：  
```
Content-Type: text/html
Date: Mon, 23 Dec 2019 06:46:19 GMT
Connection: keep-alive
Transfer-Encoding: chunked
(这里有空行)
```  

- Body:
    常见的nodejs处理过的body为chunked-body，格式为：  
```
开头一个16进制的数字  
内容部分  
16进制的数字  
内容 ...  
0数字结尾
空行
```  
    实例：  
```
26
<html><body>Hello World</body></html>
0
(空行)
```


## 服务端准备
使用http模块监听指定端口  
收到请求后返回一个成功响应  

## 客户端的构建
- 创建一个Request的类，处理内部内容
- send实现
- receive处理接受到的数据
- request的
- responseParser处理器的构造  
    > 因为response必须被分段构造，所以要有responseParser来*"装配"*  

    因为要分段处理responseText，我们使用状态机来分析文本的结构  
- response.body的parser构造
```
TODO: 自己查一查Transfer-Encoding的可选值
```

&emsp;
# HTML解析

## HTML标准：Tokenization
1. FSM(有限状态机)实现HTML解析
2. 解析标签
    - 开始标签
    - 结束标签
    - 自封闭标签
    - (暂时忽略属性)
3. 创建元素
4. 处理属性
5. 构建dom树

