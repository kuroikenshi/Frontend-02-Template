// 作业：在 selectorParts 里面去解析复合选择器

// 计算selector的sp
function specificity(selector) {
  var p = [0, 0, 0, 0];
  var selectorParts = selector.split(' ');

  for (var part of selectorParts) {
    /*
    // 简单选择器
    if (part.charAt(0) === '#') {
      p[1] += 1;
    }
    else if (part.charAt(0) === '.') {
      p[2] += 1;
    }
    else {
      p[3] += 1;
    }
    */

    // --------- 分割线 ---------

    // 复合选择器
    let queryObject = {};
    // 查找元素选择器
    let elResult = selector.match(/([^.#]*)/);
    queryObject['element'] = elResult !== null ? elResult[1] : '';
    // id选择器
    let idResult = selector.match(/#([^.#]*)/);
    queryObject['id'] = idResult !== null ? idResult[1] : '';
    // class的list
    let classResult = selector.match(/\.[^\.#]*/g);
    queryObject['classList'] = classResult !== null ? classResult.map(str => str.replace('.', '')) : [];
    console.log('classList length:', queryObject['classList'].length);

    if (!!queryObject['id']) {
      p[1] += 1;
    }
    if (queryObject['classList'].length > 0) {
      p[2] += queryObject['classList'].length;
    }
    if (!!queryObject['element']) {
      p[3] += 1;
    }
  }

  return p;
}

// 测试用代码
console.log(specificity('div.class1.class2.class3#id1'));
console.log(specificity('.class1#id1'));