学习笔记

# CSS计算
1. 收集CSS规则  
  
  利用合并标签时，检查token.name是否为style，如果是，收集top栈子节点的所有信息（之前生成和合并的text信息）  
  使用css的node模块来辅助解析  

2. 一般创建DOM树的时候，CSS规则就已经收集完毕了  
  
  理论上分析一个元素时，css已经收集完毕了  
  真实浏览器中，可能遇到再body中的style标签，需要重新计算css，这里忽略  

3. 选择器：
  - 最外层叫选择器列表
  - 复杂选择器，用空格分隔
  - 复杂选择器根据亲代关系去选择元素的
  - 复合选择器由紧连着的一些简单选择器组成  

  ToyBrowser不处理复合选择器的情况

4. 简单选择器：
  - .xxx class选择器
  - #xxx id选择器
  - xxx  tagName选择器

5. 复合选择器：
  - xxx.xxx#xxx

> 作业：支持复合选择器 & 支持空格的class选择器（复数class）

6. 生成computed属性  
  - 未解决优先级问题  

7. Specificity计算逻辑（优先级计算）

  [0,     0,  0,    0]  
  inline  id  class tag  
  从左到右，优先级依次递减  

# 排版

## 概念
以flex为基础  
内容延**主轴**延伸，排满往**交叉轴**方向扩展  

→ 主轴  
↓ 交叉轴  
对应CSS: `flex-direction: row`  

↓ 主轴  
→ 交叉轴  
对应CSS: `flex-direction: column`


1. 预处理设定flex的一些默认值

2. 根据主轴尺寸，把元素分进*行*  
  
  如果设置了no-wrap，都放到第一行去

3. 计算主轴方向  
  - 找出所有flex元素  
  - 把主轴剩余尺寸分配给这些元素  
  - 若剩余空间为负数，所有flex元素为0，等比压缩剩余元素  

4. 计算交叉轴  
  - 根据每一行中最大元素计算行高  
  - 根据flex-align、item-align确定元素具体位置  


# 绘制
## images库
1. 单个元素  
  - 依赖图形环境  
  - 在viewport上进行  
  - 绘制相关属性：border、background-color  
  
2. 渲染DOM树
  - 递归调用子元素绘制方法
