学习笔记

# Proxy
强大且危险……
为底层库设计的特性
可预期性会变差

## Proxy基本用法
object是不可监听其修改
```
let object = {
  a: 1,
  b: 2
}
```
通过使用Proxy包裹object来实现object操作的监听
```
let po = new Proxy(object, {
  // 设置钩子
  set(obj, prop) {
    console.log(obj, prop)
  }
})
```
调用原始的object对象去赋值，无法触发钩子  
比如po.a = 3，背后可能做了很多其他操作  
因此不可预测性会降低  

## 所有钩子
如果要构建某个对象的完全代理，需要考虑实现以下全部属性  
参照[Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- Proxy
- Proxy() constructor
- handler.apply
- handler.construct
- handler.defineProperty
- handler.deleteProperty
- handler.get
- handler.getOwnPropertyDescriptor
- handler.getPropertyOf
- handler.has
- handler.isExtensible
- handler.ownKeys
- handler.preventExtensions
- handler.set
- handler.setPrototypeOf
- revocable

## 构建简单reactive
见[002_reactive.html](002_reactive.html)

## 监听reactive
使用effect函数去保存set时调用的callback，完成set时所有参数变更影响的简单实现  
见[003_reactive.html](003_reactive.html)  
此时仅粗略完成了对所有set进行触发回调，有严重的性能问题

## 解决reactive性能问题
使用map保存callback和使用的值  
完成只对a调响应方法  
见[004_reactive.html](004_reactive.html)

## reactivity有什么用？
> 半成品的双向绑定，从数据->DOM元素一条线的监听

------

# Range和DOM练习

