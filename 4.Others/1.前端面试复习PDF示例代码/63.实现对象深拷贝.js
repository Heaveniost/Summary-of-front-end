function deepClone(obj){
    if(typeof obj == 'function'){
        // var cloneObj = obj
        return obj
    }
    var isArray = Array.isArray(obj)
    var cloneObj = isArray? [] : {}
    for(let key in obj){
        let flag = obj[key] instanceof Object  
        if(flag){
            cloneObj[key] = deepClone(obj[key])
        } else {
            console.log('基本数据类型', obj[key])
            cloneObj[key] = obj[key]
        }
    }
    return cloneObj
}

var obj = {name: 'xingxing', age: 18, love: ['eat', 'drink', 'sleep']}
var obj1 = {name: 'xingxing', age: 18, love: function(){console.log('tiantian')}}
var c = deepClone(obj1)
c.name = 'hurst'
c.sex = 'boy'
// c.love()
console.log(obj1, c)

//缺陷是没有考虑函数 