//导入express框架
const express = require('express')
//创建服务器
app = express()

//监听服务器 
app.get('/',  (req, res) => {
    res.send('server running')
})

//启动服务器 
app.listen('3000', () => {
    console.log('server running at https://localhost:3000')
})