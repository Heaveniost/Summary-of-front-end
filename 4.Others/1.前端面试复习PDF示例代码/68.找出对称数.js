//利用字符串的反转，判断相等 
function isNum(start, end) {
    start = (start <= 11 ? 11 : start)
    for (var i = start; i <= end; i++) {
        //reverse是数组的方法
        var strI = +(i.toString().split('').reverse().join(''))
        if (strI == i) {
            console.log(i)
        }
    }
}

isNum(1, 10000)