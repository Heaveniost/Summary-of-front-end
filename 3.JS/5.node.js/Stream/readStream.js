const fs = require("fs")
var data = ''

//创建可读流 
var readerStream = fs.createReadStream('input.txt')
//设置编码 
readerStream.setEncoding('utf8')
//处理流事件  data end error 
readerStream.on('data', chunk => {
    data += chunk
})

readerStream.on('end', () => {
    console.log(data)
})

readerStream.on('err', err => {
    console.log(err.stack)
})

console.log('程序执行完毕')
// 执行结果：
// 程序执行完毕
// 我想赚钱