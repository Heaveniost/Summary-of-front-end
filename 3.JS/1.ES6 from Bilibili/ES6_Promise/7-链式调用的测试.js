const { resolve } = require("path")

const p = new Promise((resolve, reject) => {
    console.log('1')
    // resolve('123')
    reject('456')
})

p.then(value=>{
    console.log('2')
    resolve('365')
}, reason=> console.log(reason)
).then(value=>console.log(value), reason=> console.log(reason))

console.log(p)

// 链式调用后面的then，默认都是resolve，如果是reject,传出去的对象就是undefined.