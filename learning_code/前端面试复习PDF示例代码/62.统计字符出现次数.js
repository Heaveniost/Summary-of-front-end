function countStr(str){
    var obj = {} //用一个对象存储每个字符出现的次数
    for(var i=0; i<str.length; i++){
        if(obj[str[i]]){
            obj[str[i]]++
        } else {
            obj[str[i]] = 1
        }
    }
    var arr = [] //用数组存储出现次数最多的字符，可能有多个
    var max = 0  //存储字符出现最多的次数
    for(var i in obj){
        if(obj[i] > max){
            arr = [i]
            max = obj[i]
        } else if(obj[i] == max) {
            arr.push(i)
        }
    }

    console.log('出现最多的字符为：', arr)
    console.log('出现的次数为：', max)
}

var str = 'ehriaqrebwvvawryqqwi'
countStr(str)