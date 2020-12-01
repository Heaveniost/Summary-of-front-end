const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('hello,world!'))

const server = app.listen(8081,'127.0.0.1', () => {
    const host = server.address().address
    const port = server.address().port
    console.log(server.address())
    console.log('应用实例，地址为 http://%s:%s', host, port)
})