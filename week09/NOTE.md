学习笔记

## AI设计
- 策略分级，优先级依次递减
- 棋类游戏，对方最优解相当于我方最差解
- 遍历每一步要走的点，判断对方的局势，找出最优解

### 技巧：胜负剪枝
判断已经结束战斗时，可以跳出循环，避免资源浪费

```
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (...) {
      break outer;  // 中断最外层循环，用变量名指定
    }
  }
}
```
### 技巧：使用一维数组来代替二维数组
- x = index % 3
- y = index / 3

**优点**： `Object.create`可以继承方法和数据，时间复杂度小于JSON的复制

### 技巧：使用0、1、2表示状态
- 0 代表空
- 1 代表我方
- 2 代表对方
- 1、2交替可以用`color = 3 - color`来表示

### Game关键
- `pattern` 表示当前棋盘状态
- `color` 代表棋子
- `check()` 判断输赢
- `move()` 表示下棋的手  
  可以使用userMove表示用户下手动作，computerMove表示AI动作  
- `bestChoice()`   
  构建依次的策略，遍历当前pattern下所有可能的手下完后，对方的局势  
  从而形成最优策略和对应下的点，在userMove执行完毕后的computerMove中执行  
  bestChoice递归执行直到棋局结束  
  这里算是比较奢侈的直接算到结尾，一般都是算一个最深手数的预估值  

------

## 异步编程 | async异步编程
- callback  
  常见的异步函数回调方法  
- Promise  
  es5版本支持  
- async/await  
  使用Promise实现  

### generator与异步
- generator模拟async/await  
  co框架  
- async generator

for await of 与 async generator合作
```
async function* counter () {
  let i = 0;
  while (true) {
    await sleep(1000);
    yield i++;
  }
}
(async function () {
  for await(let v of counter()) {
    console.log(v);
  }
})
```

------

## 寻路算法 
广度优先算法

**递归**是深度优先算法  
寻路问题应使用**广度优先**  

使用Javascript中Array的push和shift可以实现先进先出，即实现Queue的数据结构和方法  

### 广度优先算法
1. 有queue这么一个数据结构
2. queue中有个起点，每个循环依次把这个点取出，把它周围的所有的点加入到这个队列
3. 循环这个过程，直到queue为空

```
function path(map, start, end) {
  var queue = [start];

  function insert(x, y) {
    // 处理边界
    if (x < 0 || x >= 100 || y < 0 || y >= 100) {
      return;
    }
    // 如果是已经寻过的点(值为2)或者是墙(值为1)，也不放到队列里去
    if (map[y * 100 + x]) {
      return;
    }
    map[y * 100 + x] = 2;
    queue.push([x, y]);
  }

  while(queue.length) {
    let [x, y] = queue.shift();
    console.log(x, y);
    if (x === end[0] && y === end[1]) {
      return true;
    }
    insert(x - 1, y);
    insert(x + 1, y);
    insert(x, y - 1);
    insert(x, y + 1);
  }
}
```

### 启发式寻路
通过启发函数指定寻路扩展优先级  
在广度的基础上，对queue使用有优先级的数据结构  

排序的数据结构可以是：  
- 数组
- winner tree
- heap 堆
