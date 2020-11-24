// https://www.cnblogs.com/smallpen/p/10249288.html

const arr = [1,2,3,4,5]
// const arr = ['12','23','34']

const fn = function(pre, item) {
    console.log(pre, item)
    return pre + item 
}

const sum = arr.reduce(fn,2)

console.log(sum,arr)

// 高级用法 
// 统计字符串每个字符出现的次数 
const str = 'asdfcqerczaqfw'

const obj = str.split('').reduce((pre,item) => {
    pre[item] ? pre[item]++ : pre[item] = 1
    return pre
}, {})

console.log(obj)