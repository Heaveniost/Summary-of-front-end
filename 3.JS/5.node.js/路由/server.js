const http = require('http')
const url = require('url')

function start(route) {
    function onRequest(request, response) {
        const pathname = url.parse(request.url).pathname 
        console.log('request for' + pathname + 'received.')
        
        route(pathname)

        response.writeHead(200, {'Content-Type': 'text/plain',})
        response.write('I miss u.')
        response.end()
    }

    http.createServer(onRequest).listen(8888)
    console.log('Server has started.')
}

exports.start = start 