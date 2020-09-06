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

for (let token of tokenize('1024 + 10 * 25')) {
  console.log(token);
}
