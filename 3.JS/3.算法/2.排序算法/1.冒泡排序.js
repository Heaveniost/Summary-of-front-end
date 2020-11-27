// 由小到大
function sort(arr) {
    var len = arr.length
    var tmp;
    for(var i=0; i<len-1; i++){
        for(var j=0; j<len-i-1; j++){
            if(arr[j]>arr[j+1]) {
                tmp = arr[j+1]
                arr[j+1] = arr[j]
                arr[j] = tmp 
            }
        }
        // console.log('第' + (i+1) + '次循环:', arr)
    }
}

var arr = [12,32,1,3,5,6,7,98,4,3,44]
sort(arr) // 注意sort没有返回值
console.log(arr)