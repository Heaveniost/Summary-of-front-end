const http = require('http')

const options = {
    host: 'localhost',
    port: '8080',
    path: '/index.html'
}

const callback = response => {
    let body = ''
    response.on('data', data => body += data)
    response.on('end', () => console.log(body))
}

const req = http.request(options, callback)
req.end()