const http = require('http');
const https = require('https');
const unzipper = require('unzipper');
const querystring = require('querystring');

function auth(request, response) {
  const query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);
  getToken(query.code, (info) => {
    console.log('info', info)
    response.write(`<a href="http://localhost:8089/?token=${info.access_token}">publish</a>`)
    response.end();
  });
}

function publish(request, response) {
  const query = querystring.parse(request.url.match(/^\/publish\?([\s\S]+)$/)[1]);

  getUser(query.token, info => {
    if (info.login === 'kuroikenshi') {
      request.pipe(unzipper.Extract({
        path: '../server/public'
      }));
      request.on('end', () => {
        response.end("Success!")
      })
    }
  })
}

function getUser(token, callback) {
  const request = https.request({
    hostname: 'api.github.com',
    path: `/user`,
    port: 443,
    method: "GET",
    headers: {
      Authorization: `token ${token}`,
      "User-Agent": 'toy-publish-qiyue'
    }
  }, function(response) {
    let body = "";
    response.on('data', chunk => {
      console.log(chunk.toString());
      body += (chunk.toString());
    })
    response.on('end', () => {
      callback(JSON.parse(body));
    })
  });

  request.end();
}

function getToken(code, callback) {
  const request = https.request({
    hostname: 'github.com',
    path: `/login/oauth/access_token?code=${code}&client_id=Iv1.febbed76f478f27c&client_secret=24a449fd37d55fc9957daf8c864439098bf73d7a`,
    port: 443,
    method: "POST",
  }, function(response) {
    let body = "";
    response.on('data', chunk => {
      console.log(chunk.toString());
      body += (chunk.toString());
    })
    response.on('end', () => {
      callback(querystring.parse(body));
    })
  });
  request.end();
}


http.createServer(function(request, response) {
  if (request.url.match(/^\/auth\?/)) {
    return auth(request, response);
  }
  if (request.url.match(/^\/publish\?/)) {
    return publish(request, response);
  }

}).listen(8088);