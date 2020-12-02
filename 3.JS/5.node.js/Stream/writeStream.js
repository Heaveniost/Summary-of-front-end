const fs = require('fs')
const data = "没钱活的不开心"

var writeStream = fs.createWriteStream('Stream/out.txt')

writeStream.write(data, 'utf8')

writeStream.end()

writeStream.on('finish', () => {
    console.log('写入完成')
})

writeStream.on('error', err => {
    console.log(err.stack)
})

console.log('程序执行完毕')