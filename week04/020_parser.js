let currentToken = null;
let currentAttribute = null;

let currentTextNode = null;

let stack = [{type: 'document', children: []}];

// 输出token用
function emit(token) {
  if (token.type === 'text') {
    if (currentTextNode === null) {
      currentTextNode = {
        type: 'text',
        content: ''
      }
      top.children.push(currentTextNode);
    }

    currentTextNode.content += token.content;
  }
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
          value: token['p']
        });

      }
    }

    top.children.push(element);
    element.parent = top;   // 对偶操作

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
      stack.pop();
    }
    
    currentTextNode = null;
  }
}

const EOF = Symbol("EOF");

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

  console.log(stack[0]);
}

