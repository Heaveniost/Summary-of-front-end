const fs = require("fs")

// 阻塞代码示例
// const data = fs.readFileSync('input.txt')

// console.log(data.toString())
// console.log("program end!")

// 非阻塞代码示例
fs.readFile('input.txt', (err, data) => {
    if(err) return console.error(err)
    console.log(data.toString())
})
 
console.log("程序结束")