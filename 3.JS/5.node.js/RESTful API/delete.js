const express = require('express')
const app = express()
const fs = require('fs')

// 指定待删除的用户id
const id = 2

app.get('/deleteUser', (req, res) => {
    fs.readFile(__dirname + '/users.json', 'utf8', (err, data) => {
        data = JSON.parse(data)
        delete data["user" + id]
        console.log(data)
        res.end(JSON.stringify(data))
    })
})

const server = app.listen(8081, '127.0.0.1', () => {
    const host = server.address().address
    const port = server.address().port

    console.log('应用实例，访问地址为 http://%s:%s', host, port)
})