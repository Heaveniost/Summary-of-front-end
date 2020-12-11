const { json } = require('body-parser')
const express = require('express')
const app = express()
const fs = require('fs')

// 定义用户数据 
const user = {
    "user4": {
        "name": "heaven",
        "password": "password4",
        "profession": "master",
        "id": 4
    }
}

app.get('/addUser', (req, res) => {
    fs.readFile(__dirname + '/users.json', 'utf8', (err, data) => {
        data = JSON.parse(data)
        data["user4"] = user["user4"]
        console.log(data)
        res.end(JSON.stringify(data))
    })
})

const server = app.listen(8081, '127.0.0.1', () => {
    const host = server.address().address
    const port = server.address().port

    console.log('应用实例，访问地址为 http://%s:%s', host, port)
})