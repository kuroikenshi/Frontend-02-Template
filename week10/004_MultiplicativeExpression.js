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

for (let token of tokenize('10 * 25 / 2')) {
  if (token.type !== 'Whitespace' && token.type !== 'LineTerminator') {
    source.push(token);
  }
}

function Expression(tokens) {

}

function AdditiveExpression(source) {

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

MultiplicativeExpression(source);

