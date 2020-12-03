// 请求node.js自带的http模块 
const http = require('http')

// 调用http模块中的函数createServer 
http.createServer(function(request, response){
    response.writeHead(200, {'Content-Type': 'text/plain'})

    response.end('Would u miss me?\n')
}).listen(8888)

console.log('Server running at http://127.0.0.1:8888')