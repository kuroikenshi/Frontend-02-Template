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

    let html = '<html maaa=a ><head><style>body div #myid{width: 100px;background-color: #ff5000;}body div img {width: 30px;background-color: #ff1111;}</style></head><body><div><img id="myid" /><img /></div></body></html>';

    resp.end(html);
  });
}).listen(8088);

console.log('Server started');
