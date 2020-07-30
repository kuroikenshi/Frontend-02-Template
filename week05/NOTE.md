学习笔记

# CSS计算
1. 收集CSS规则  
  
  利用合并标签时，检查token.name是否为style，如果是，收集top栈子节点的所有信息（之前生成和合并的text信息）  
  使用css的node模块来辅助解析  