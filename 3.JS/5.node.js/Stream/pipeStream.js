const fs = require('fs')
// 读取文件都是相对于代码执行时所在的路径，跟js文件所在路径无关
const readStream = fs.createReadStream('input.txt')  
const writeStream = fs.createWriteStream('Stream/out.txt')

readStream.pipe(writeStream)

console.log('程序执行完毕')