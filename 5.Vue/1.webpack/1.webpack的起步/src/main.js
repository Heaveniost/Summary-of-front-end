const {add, mul}  = require('./js/mathUtils.js')

console.log(add(20,30))
console.log(mul(20,30))


import {name, age, height} from './js/info'

console.log(name)

//依赖css文件
require('./css/normal.css')

//导入less文件
require('./css/special.less')

document.writeln('<h2>我是Hurst</h2>')