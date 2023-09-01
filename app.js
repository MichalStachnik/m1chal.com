const http = require('http');

http.createServer(function(req, res){
res.write('welcome to my simple server :)');
res.end();
}).listen(3000);

console.log('server started on 3000');
