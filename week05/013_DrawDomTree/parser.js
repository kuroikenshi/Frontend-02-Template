const css = require('../node_modules/css');

const EOF = Symbol("EOF");

const layout = require('./layout.js')

let currentToken = null;
let currentAttribute = null;

let currentTextNode = null;

let stack = [{type: 'document', children: []}];

// css处理部分
let rules = [];
function addCSSRules(text) {
  let ast = css.parse(text);
  // // console.log(JSON.stringify(ast, null, '    '));
  rules.push(...ast.stylesheet.rules);
}

// 匹配element和选择器
function match(element, selector) {
  if (!selector || !element.attributes) {
    return false;
  }

  /* 
  // 简单选择器
  if (selector.charAt(0) == "#") {
    var attr = element.attributes.filter(attr => attr.name === "id")[0];
    if (attr && attr.value === selector.replace("#", '')) {
      return true;
    }
  }
  else if (selector.charAt(0) == '.') {
    var attr = element.attributes.filter(attr => attr.name === "class")[0];
    if (attr && attr.value === selector.replace(".", '')) {
      return true;
    }
  }
  else if (element.tagName === selector) {
    return true;
  }
  */

  // 复合选择器
  // 作业：支持复合选择器 & 支持空格的class选择器（复数class）
  let queryObject = {};
  // 查找元素选择器
  let elResult = selector.match(/([^.#]*)/);
  queryObject['element'] = elResult !== null ? elResult[1] : '';
  // id选择器
  let idResult = selector.match(/#([^.#]*)/);
  queryObject['id'] = idResult !== null ? idResult[1] : '';
  // class的list
  // console.log('selector    >>>', selector);
  let classResult = selector.match(/\.[^\.#]*/g);
  queryObject['classList'] = classResult !== null ? classResult.map(str => str.replace('.', '')) : [];

  // console.log('queryObject >>>', queryObject);
  // // console.log('\n\n');

  // 需要match的全match了，才认为通过match
  let matchFlag = 0;
  let needMatch = 0;

  // 检查tagName <-> element
  needMatch += 1;
  if (!queryObject['element']) {
    needMatch -= 1;
    // console.log('Element -> no need to check');
  }
  else if (element.tagName === queryObject['element']) {
    matchFlag += 1;
    // console.log('Element -> OK');
  }
  else {
    // console.log('Element -> NG');
  }

  // 检查classList <-> classList
  needMatch += 1;
  if (queryObject['classList'].length == 0) {
    needMatch -= 1;
    // console.log('ClassList -> no need to check')
  }
  else {
    let attr = element.attributes.filter(attr => attr.name === "class")[0];
    let classStr = attr ? attr.value : '';
    let classList = !!classStr ? classStr.split(' ') : [];
    let qClassList = queryObject['classList'];


    let isUnique = (classList.length == Array.from(new Set(classList)).length) &&
        (qClassList.length == Array.from(new Set(qClassList)).length);

    // 判断class在element和query中都没有重复，再继续
    if (isUnique) {
      let classMatched =
          classList.length === qClassList.length
          && 
          classList.every(a =>
            qClassList.some(b => a === b)
          )
          &&
          qClassList.every(_b => 
            classList.some(_a => _a === _b));

      if (classMatched) {
        matchFlag += 1;
        // console.log('ClassList -> OK');
      }
      else {
        // console.log('ClassList -> NG');
      }
    } 
  }

  // 检查id <-> id
  needMatch += 1;
  if (!queryObject['id']) {
    needMatch -= 1;
    // console.log('ID -> not need check');
  }
  else {
    var attr = element.attributes.filter(attr => attr.name === "id")[0];
    if (attr && attr.value === queryObject['id']) {
      matchFlag += 1;
      // console.log('ID -> OK');
    }
    else {
      // console.log('ID -> NG');
    }
  }

  if (needMatch > 0 && needMatch === matchFlag) {
    // console.log('---------------\nFINAL -> OK\n');
    return true;
  }
  else {
    // console.log('---------------\nFINAL -> NG\n');
    return false;
  }
}

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
    // console.log('classList length:', queryObject['classList'].length);

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

// 比较两个元素的sp
function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0];
  }
  if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1];
  }
  if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2];
  }

  return sp1[3]- sp2[3];
}


function computeCSS(element) {
  // 复制当前栈，做逆转，从子元素开始遍历
  var elements = stack.slice().reverse();

  if (!element.computedStyle) {
    element.computedStyle = {};
  }

  for (let rule of rules) {
    // ast中每个rule中会有个selectors的数组, 跟elements保持一致，也翻转一下
    var selectorParts = rule.selectors[0].split(" ").reverse();

    if (!match(element, selectorParts[0])) {
      continue;
    }

    let matched = false;

    var j = 1;
    for (var i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++;
      }
    }

    if (j >= selectorParts.length) {
      matched = true;
    }

    if (matched) {
      // 如果匹配，我们要加入
      // console.log('Element', element, 'matched rule:', rule, '\n');
      var sp = specificity(rule.selectors[0]);
      var computedStyle = element.computedStyle;
      for (var declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {};
        }

        // 没有优先级，记录当前属性和优先级
        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        }
        // 如果当前优先级比记录优先级高，记录当前属性和优先级
        else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        }
        
      }

      console.log(element.computedStyle);
    }
  }
}


// 输出token用
function emit(token) {
  let top = stack[stack.length - 1];

  // 处理开始标签
  if (token.type === 'startTag') {
    let element = {
      type: 'element',
      children: [],
      attributes: []
    };

    element.tagName = token.tagName;

    for (let p in token) {
      if (p !== 'type' && p !== 'tagName') {
        element.attributes.push({
          name: p,
          value: token[p]
        });

      }
    }

    // 计算css
    computeCSS(element);

    top.children.push(element);
    // element.parent = top;   // 对偶操作

    if (!token.isSelfClosing) {
      stack.push(element);
    }

    currentTextNode = null;

  }
  // 处理结束标签
  else if (token.type === 'endTag') {
    if (top.tagName != token.tagName) {
      throw new Error('Tag start end doesn\'t match!');
    }
    else {
      // 遇到style的结束标签，执行添加css规则的操作
      if (top.tagName === 'style') {
        // // console.log('>>>', top.children);
        addCSSRules(top.children[0].content);
      }

      layout(top);

      stack.pop();
    }
    currentTextNode = null;
  }
  // 处理文本节点
  else if (token.type === 'text') {
    if (currentTextNode === null) {
      currentTextNode = {
        type: 'text',
        content: ''
      }
      top.children.push(currentTextNode);
    }

    currentTextNode.content += token.content;
  }
}

// HTML解析初始状态叫data
function data(c) {
  if (c === "<") {
    return tagOpen;
  }
  else if (c === EOF) {
    emit({
      type: 'EOF'
    });
  }
  else {
    emit({
      type: 'text',
      content: c
    })
    return data;
  }
}

function tagOpen(c) {
  if (c === '/') {
    return endTagOpen;
  }
  else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: ''
    };
    return tagName(c);
  }
  else {
    return ;
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: ''
    };
    return tagName(c);
  }
  else if (c === '>') {
    // ...
  }
  else if (c === EOF) {
    // ...
  }
  else {
    // ...
  }
}

function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  }
  else if (c === '/') {
    return selfClosingStartTag;
  }
  else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c;
    return tagName;
  }
  else if (c === '>') {
    emit(currentToken);
    return data;
  }
  else {
    return tagName;
  }
}

function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  }
  else if (['/', '>', EOF].indexOf(c) !== -1) {
    return afterAttributeName(c);
  }
  else if (c === '=') {
    // ...
  }
  else {
    currentAttribute = {
      name: "",
      value: ""
    };
    return attributeName(c);
  }
}

function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/) || ['/', '>', EOF].indexOf(c) !== -1) {
    return afterAttributeName(c);
  }
  else if (c == "=") {
    return beforeAttributeValue;
  }
  else if (c == "\u0000") {
    // ...
  }
  else if (c == '"' || c == "'" || c == '<') {
    // ...
  }
  else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || ['/', '>', EOF].indexOf(c) !== -1) {
    return beforeAttributeValue;
  }
  else if (c === '"') {
    return doubleQuotedAttributeValue;
  }
  else if (c === "'") {
    return singleQuotedAttributeValue;
  }
  else {
    return unquotedAttributeValue(c);
  }
}

function doubleQuotedAttributeValue(c) {
  if (c === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  }
  else if (c === '\u0000') {
    // ...
  }
  else if (c === EOF) {
    // ...
  }
  else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function singleQuotedAttributeValue(c) {
  if (c === "'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  }
  else if (c === '\u0000') {
    // ...
  }
  else if (c === EOF) {
    // ...
  }
  else {
    currentAttribute.value += c;
    return singleQuotedAttributeValue;
  }
}

function afterQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  }
  else if (c === '/') {
    return selfClosingStartTag;
  }
  else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  }
  else if (c === EOF) {
    // ...
  }
  else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function unquotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  }
  else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  }
  else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  }
  else if (c === '\u0000') {
    // ...
  }
  else if (['"', "'", '<', '=', '`'].indexOf(c) !== -1) {
    // ...
  }
  else if (c === EOF) {
    // ...
  }
  else {
    currentAttribute.value += c;
    return unquotedAttributeValue;
  }
}

function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  }
  else if (c === '/') {
    return selfClosingStartTag;
  }
  else if (c === '=') {
    return beforeAttributeValue;
  }
  else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  }
  else if (c === EOF) {
    // ...
  }
  else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: '',
      value: ''
    };
    return attributeName(c);
  }
}

function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  }
  else if (c === EOF) {
    // ...
  }
  else {
    // ...
  }
}


module.exports.parseHTML = function parseHTML(html){
  let state = data;

  for (let c of html) {
    state = state(c);
  }

  state = state(EOF);

  return stack[0];
  // // console.log(stack[0]);

  // // console.log('\n\n\nStyleRules>>>');
  // // console.log(rules);
  // // console.log('<<<StyleRules\n\n\n');
}

