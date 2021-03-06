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

    resp.end('Hello World\n');
  });
}).listen(8088);

console.log('Server started');
