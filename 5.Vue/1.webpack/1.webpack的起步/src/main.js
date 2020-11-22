// 1.使用common.js的模块化规范
const { add, mul } = require('./js/mathUtils.js')

console.log(add(20, 30))
console.log(mul(20, 30))

// 2.使用es6的模块化规范
import { name, age, height } from './js/info'

console.log(name)

// 3.依赖css文件
require('./css/normal.css')

// 4.导入less文件
require('./css/special.less')

document.writeln('<h2>我是Hurst</h2>')


// 5.使用Vue进行开发
import Vue from 'vue'
import App from './vue/App.vue'

new Vue({
    el: '#app',
    template: '<App/>',
    components: {
        App
    }
})

document.write('<h2>webpack is finished.</h2><h2>内心很开心。</h2>')
