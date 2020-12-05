const http = require('http')
const fs = require('fs')
const url = require('url')

http.createServer( (request, response) => {
    const pathname = url.parse(request.url).pathname
    console.log('request for' + pathname + ' received.')
    const path = 'web模块' + pathname
    console.log(typeof path)
    console.log(path)
    
    fs.readFile('web模块/index.html', (err,data) => {
        if (err) {
            console.log(err)
            response.writeHead(404, {'Content-Type': 'text/html'})
        } else {
            response.writeHead(200, {'Content-Type': 'text/html'})
        }
        response.write(data)
        response.end()
    })
}).listen(8080)

console.log('Server running at http://127.0.0.1:8080/')