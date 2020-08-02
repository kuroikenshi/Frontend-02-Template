

function getStyle(element) {
  // 主要目标：把px标识的属性变成纯粹的数字
  if (!element.style) {
    element.style = {};
  }
  for (let prop in element.computedStyle) {
    var p = element.computedStyle.value;
    element.style[prop] = element.computedStyle[prop].value;

    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
    if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    } 
  }

  return element.style;
}


function layout(element) {

  if (!element.computedStyle) {
    return ;
  }

  var elementStyle = getStyle(element);

  if (elementStyle.display !== 'flex') {
    return ;
  }

  var items = element.children.filter(e => e.type === 'element');

  items.sort(function(a, b) {
    return (a.order || 0) - (b.order || 0);
  });

  var style = elementStyle;

  ['width', 'height'].forEach(size => {
    if (style[size] === 'auto' || style[size] === '') {
      style[size] = null;
    }
  });

  if (!style.flexDirection || style.flexDirection === 'auto') {
    style.flexDirection = 'row';
  }
  if (!style.alignItems || style.alignItems === 'auto') {
    style.alignItems = 'stretch';
  }
  if (!style.justifyContent || style.justifyContent === 'auto') {
    style.justifyContent = 'flex-start';
  }
  if (!style.flexWrap || style.flexWrap === 'auto') {
    style.flexWrap = 'nowrap';
  }
  if (!style.alignContent || style.alignContent === 'auto') {
    style.alignContent = 'stretch';
  }

  var mainSize, mainStart, mainEnd, mainSign, mainBase,
      crossSize, crossStart, crossEnd, crossSign, crossBase;
  if (style.flexDirection === 'row') {
    mainSize = 'width';
    mainStart = 'left';
    mainEnd = 'right';
    mainSign = +1;
    mainBase = 0;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  }
  if (style.flexDirection === 'row-reverse') {
    mainSize = 'width';
    mainStart = 'right';
    mainEnd = 'left';
    mainSign = -1;
    mainBase = style.width;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  }

  if (style.flexDirection === 'column') {
    mainSize = 'height';
    mainStart = 'top';
    mainEnd = 'bottom';
    mainSign = +1;
    mainBase = 0;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }
  if (style.flexDirection === 'column-reverse') {
    mainSize = 'height';
    mainStart = 'bottom';
    mainEnd = 'top';
    mainSign = -1;
    mainBase = 0;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }

  if (style.flexWrap === 'wrap-reverse') {
    var tmp = crossStart;
    crossStart = crossEnd;
    crossEnd = tmp;
    crossSign = -1;
  } else {
    crossBase = 0;
    crossSign = +1;
  }


  var isAutoMainSize = false;
  if (!style[mainSize]) { // auto sizing
    elementStyle[mainSize] = 0;

    for (var i = 0; i < items.length; i++) {
      var item = items[i];

      if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== 'auto') {     // <- 这里有可能有错
        elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];  // <- 这里有可能有错
      }
    }
    isAutoMainSize = true;
  }
  // 处理掉auto-sizing的特殊情况


  var flexLine = [];
  var flexLines = [flexLine];

  var mainSpace = elementStyle[mainSize];   // 剩余空间
  var crossSpace = 0;                       // 剩余空间

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var itemStyle = getStyle(item);

    if (itemStyle[mainSize] === null) {
      itemStyle[mainSize] = 0;
    }

    // 注意是flex属性
    if (itemStyle.flex) {
      flexLine.push(item);
    }
    // 强制不换行逻辑
    else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
      mainSpace -= itemStyle[mainSize];
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      flexLine.push(item);

    }
    // 换行逻辑
    else {
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize];
      }

      // 主轴剩余空间不足以容纳更多的元素了，换行
      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace;
        flexLine.crossSpace = crossSpace;
        // 前面两行处理旧的flexLine，下边是新建的行
        flexLine = [item];
        flexLines.push(flexLine);
        mainSpace = style[mainSize];
        crossSpace = 0;
      }
      else {
        flexLine.push(item);
      }

      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      mainSpace -= itemStyle[mainStyle];
    }
  }

  flexLine.mainSpace = mainSpace;

  console.log('items>>>', items);
}

module.exports = layout;
