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
#container {
    width:500px;
    height:300px;
    display:flex;
    background-color:rgb(255,255,255);
}
#container #myid {
    width:200px;
    height:100px;
    background-color:rgb(255,0,0);
}
#container .c1 {
    flex:1;
    background-color:rgb(0,255,0);
}
    </style>
</head>
<body>
    <div id="container">
        <div id="myid"></div>
        <div class="c1"></div>
    </div>
</body>
</html>`;

    resp.end(html);
  });
}).listen(8088);

console.log('Server started');
