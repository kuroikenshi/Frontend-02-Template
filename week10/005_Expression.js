// 词法分析
var regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g;

var dictionary = ['Number', 'Whitespace', 'LineTerminator', '*', '/', '+', '-'];

function* tokenize(source) {
  var result = null;
  var lastIndex = 0;
  while(true) {
    lastIndex = regexp.lastIndex;
    result = regexp.exec(source);
    if (!result) {
      break;
    }
    // 有可能出现不认识的字符，直接break
    if (regexp.lastIndex - lastIndex > result[0].length) {
      break;
    }

    let token = {
      type: null,
      value: null
    }

    for (var i = 1; i <= dictionary.length; i++) {
      if (result[i]) {
        token.type = dictionary[i - 1];
      }
    }
    token.value = result[0];
    yield token;
  }
  // 处理EOF
  yield {
    type: 'EOF'
  }
}

let source = [];

for (let token of tokenize('1 + 2 * 5 + 3')) {
  if (token.type !== 'Whitespace' && token.type !== 'LineTerminator') {
    source.push(token);
  }
}

function Expression() {
  if (source[0].type === 'AdditiveExpression' &&
      source[1] && source[1].type === 'EOF') {
    let node = {
      type: 'Expression',
      children: [source.shift(), source.shift()]
    };
    source.unshift(node);
    return node;
  }
  AdditiveExpression(source);
  return Expression(source);
}

function AdditiveExpression(source) {
  if (source[0].type === 'MultiplicativeExpression') {
    let node = {
      type: 'AdditiveExpression',
      children: [source[0]]
    };
    source[0] = node;
    return AdditiveExpression(source);
  }
  if (source[0].type === 'AdditiveExpression' && 
      source[1] && source[1].type === '+') {
    let node = {
      type: 'AdditiveExpression',
      operator: '+',
      children: []
    };
    node.children.push(source.shift());
    node.children.push(source.shift());
    
    // 因为AdditiveExpression的第三项是非终结符“乘法表达式”所以本身也需要调用一次去把source中的非终结符给处理掉
    MultiplicativeExpression(source);
    
    node.children.push(source.shift());
    source.unshift(node);
    return AdditiveExpression(source);
  }
  if (source[0].type === 'AdditiveExpression' && 
      source[1] && source[1].type === '-') {
    let node = {
      type: 'AdditiveExpression',
      operator: '-',
      children: []
    };
    node.children.push(source.shift());
    node.children.push(source.shift());
    
    // 因为AdditiveExpression的第三项是非终结符“乘法表达式”所以本身也需要调用一次去把source中的非终结符给处理掉
    MultiplicativeExpression(source);
    
    node.children.push(source.shift());
    source.unshift(node);
    return AdditiveExpression(source);
  }
  if (source[0].type === 'AdditiveExpression') {
    return source[0];
  }
  // 遇到不认识的，应该首先执行下乘法的识别方法
  MultiplicativeExpression(source);
  // 这个应该永远不会执行
  return AdditiveExpression(source);
}

function MultiplicativeExpression(source) {
  if (source[0].type === 'Number') {
    let node = {
      type: 'MultiplicativeExpression',
      children: [source[0]]
    };
    source[0] = node;
    return MultiplicativeExpression(source);
  }
  if (source[0].type === 'MultiplicativeExpression' && 
      source[1] && source[1].type === '*') {
    let node = {
      type: 'MultiplicativeExpression',
      operator: '*',
      children: []
    };
    node.children.push(source.shift());
    node.children.push(source.shift());
    node.children.push(source.shift());
    source.unshift(node);
    return MultiplicativeExpression(source);
  }
  if (source[0].type === 'MultiplicativeExpression' && 
      source[1] && source[1].type === '/') {
    let node = {
      type: 'MultiplicativeExpression',
      operator: '/',
      children: []
    };
    node.children.push(source.shift());
    node.children.push(source.shift());
    node.children.push(source.shift());
    source.unshift(node);
    return MultiplicativeExpression(source);
  }
  if (source[0].type === 'MultiplicativeExpression') {
    return source[0];
  }

  // 这个应该永远不会执行
  return MultiplicativeExpression(source);
}

Expression();

