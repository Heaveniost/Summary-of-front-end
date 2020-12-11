function print() {
    console.log('Do u love me?')
}

const t = setTimeout(print, 2000)

console.log('定时器是同步执行吗') //先执行这行代码再执行计时器 

clearTimeout(t)