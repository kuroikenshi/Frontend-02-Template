// 作业：支持复合选择器 & 支持空格的class选择器（复数class）
/**
 * FILE: ./parse.js
 */
const css = require('../node_modules/css');

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
      console.log('Element', element, 'matched rule:', rule, '\n');
      // TODO
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
      // 遇到style的结束标签，执行添加css规则的操作
      if (top.tagName === 'style') {
        // // console.log('>>>', top.children);
        addCSSRules(top.children[0].content);
      }

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

  // // console.log(stack[0]);

  // // console.log('\n\n\nStyleRules>>>');
  // // console.log(rules);
  // // console.log('<<<StyleRules\n\n\n');
}



/**
 * FILE: ./client.js
 */
const net = require('net');
const parser = require('./parser.js');


class Request {
  constructor(options){
    this.method = options.method || 'GET';
    this.host = options.host;
    this.port = options.port || 80;
    this.path = options.path || '/';
    this.body = options.body || {};
    this.headers = options.headers || {};

    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    if (this.headers['Content-Type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body);
    }
    else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');
    }

    this.headers['Content-Length'] = this.bodyText.length;
  }

  send(connection){
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser;

      if (connection) {
        connection.write(this.toString());
      }
      else {
        connection = net.createConnection({
          host: this.host,
          port:this.port
        }, () => {
          connection.write(this.toString());
        })
      }

      connection.on('data', (data) => {
        // console.log('data>>>', data.toString(), '<<<END of data');
        parser.receive(data.toString());

        if (parser.isFinish) {
          resolve(parser.response);
          connection.end();
        }
      });

      connection.on('error', (err) => {
        reject(err);
        connection.end();
      });

    });
  }

  toString(){
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map((key) => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`
  }
}


// 响应的解析器
class ResponseParser {
  constructor(){
    this.WAITING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1;
    this.WAITING_HEADER_NAME = 2;
    this.WAITING_HEADER_SPACE = 3;
    this.WAITING_HEADER_VALUE = 4;
    this.WAITING_HEADER_LINE_END = 5;
    this.WAITING_HEADER_BLOCK_END = 6;
    this.WAITING_BODY = 7;

    this.current = this.WAITING_STATUS_LINE;

    this.statusLine = "";
    this.headers = {};
    this.headerName = "";
    this.headerValue = "";
    this.bodyParser = null;
  }

  get isFinish(){
    return this.bodyParser && this.bodyParser.isFinish;
  }

  get response(){
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join('')
    }
  }

  receive(string){
    for(let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i));
    }
  }

  receiveChar(char){
    // 等待StatusLine的结束，并逐渐生成statusLine数据
    if (this.current === this.WAITING_STATUS_LINE) {
      if (char === '\r') {
        this.current = this.WAITING_STATUS_LINE_END;
      }
      else {
        this.statusLine += char;
      }
    }
    else if (this.current === this.WAITING_STATUS_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME;
      }
    }
    // 等待并处理headerName
    else if (this.current === this.WAITING_HEADER_NAME) {
      // 累积headerName，直到遇到冒号，开始等空格，等到空格开始等headerValue
      if (char === ':') {
        this.current = this.WAITING_HEADER_SPACE;
      }
      else if (char === '\r') {
        this.current = this.WAITING_HEADER_BLOCK_END;
        // 此时，所有header信息都已经收到了，可以根据类型开始选择body的格式了
        if (this.headers['Transfer-Encoding'] === 'chunked') {
          this.bodyParser = new TrunkedBodyParser();
        }
      }
      else {
        this.headerName += char;
      }
    }
    else if (this.current === this.WAITING_HEADER_SPACE) {
      if (char === ' ') {
        this.current = this.WAITING_HEADER_VALUE;
      }
    }
    // 等待并处理headerValue
    else if (this.current === this.WAITING_HEADER_VALUE) {
      // 积累headerValue，直到遇到\r，存储当前的headerName和headerValue
      // 并清空已存headerName和headerValue
      if (char === '\r') {
        this.current = this.WAITING_HEADER_LINE_END;
        this.headers[this.headerName] = this.headerValue;
        this.headerName = "";
        this.headerValue = "";
      }
      else {
        this.headerValue += char;
      }
    }
    else if (this.current === this.WAITING_HEADER_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME;
      }
    }
    else if (this.current === this.WAITING_HEADER_BLOCK_END) {
      if (char === '\n') {
        this.current = this.WAITING_BODY;
      }
    }
    else if (this.current === this.WAITING_BODY) {
      // 塞给bodyParser去处理
      this.bodyParser.receiveChar(char);
    }
  }
}

void async function(){
  let request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: 8088,
    path: '/',
    headers: {
      ['X-Foo2']: "customed"
    }, 
    body: {
      name: 'winter'
    }
  });

  let response = await request.send();

  // console.log('response>>>', response);

  // 正式htmlParse是一个流式解析的过程
  let dom = parser.parseHTML(response.body);
}();


// 响应body的解析器-chunked类型
class TrunkedBodyParser {
  constructor() {
    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINE_END = 1;
    this.READING_TRUNK = 2;
    this.WAITING_NEW_LINE = 3;
    this.WAITING_NEW_LINE_END = 4;

    this.length = 0;
    this.content = [];
    this.isFinish =  false;
    this.current = this.WAITING_LENGTH;
  }

  receiveChar(char) {
    if (this.current === this.WAITING_LENGTH) {
      if (char === '\r') {
        if (this.length === 0) {
          this.isFinish = true;   // 遇到一个长度为0的chunked
        }
        this.current = this.WAITING_LENGTH_LINE_END;
      }  
      else {
        this.length *= 16;
        this.length += parseInt(char, 16);
      }
    }
    else if (this.current === this.WAITING_LENGTH_LINE_END) {
      if (char === '\n') {
        this.current = this.READING_TRUNK;
      }
    }
    else if (this.current === this.READING_TRUNK) {
      this.content.push(char);
      this.length --;
      if (this.length === 0) {
        this.current = this.WAITING_NEW_LINE;
      }
    }
    else if (this.current === this.WAITING_NEW_LINE) {
      if (char === '\r') {
        this.current = this.WAITING_NEW_LINE_END;
      }
    }
    else if (this.current === this.WAITING_NEW_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_LENGTH;
      }
    }
  }
}



/**
 * FILE: ./server.js
 */
const http = require('http');

http.createServer((req, resp) => {
  let body = [];

  req.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    // body.push比如传入buffer数组或者是Uint8Array
    // body.push(chunk.toString());
    // 所以上句改成
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();

    console.log('body:', body);

    resp.writeHead(200, {'Content-Type': 'text/html'});

    let html = 
`<html maaa=a >
<head>
    <style>
body div #myid{
    width: 100px;
    background-color: #ff5000;
}
body div img{
    width: 30px;
    background-color: #ff1111;
}
body div.class1.class2{
    width: 50px;
    height: 50px;
    background-color: #ff11ff;
}
body div.class1#id2{
    width: 75px;
    height: 75px;
    background-color: #aa11ff;
}
    </style>
</head>
<body>
    <div>
        <img id="myid" />
        <img />
    </div>
    <div class="class1 class2"></div>
    <div class="class1" id="id2"></div>
</body>
</html>`;

    resp.end(html);
  });
}).listen(8088);

console.log('Server started');

