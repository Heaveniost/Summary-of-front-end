function parseQueryString(argu){
    var str = argu.split('?')[1]
    var obj = {}
    var temp = str.split('&')
    for(var i=0; i<temp.length; i++){
        var arr = temp[i].split('=')
        // obj.arr[0] = arr[1] 这种写法有问题
        // obj[arr[0]] = arr[1] 这种写法没问题，区别在哪 
        var c = arr[0]
        console.log(c)
        obj[c] = arr[1]

    }
    return obj
}

var url='http://www.demo.cn/index.html?key1=val1&key2=val2'
console.log(parseQueryString(url))