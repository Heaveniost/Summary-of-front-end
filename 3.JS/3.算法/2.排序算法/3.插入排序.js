// 每次找一个元素插入到已排序的序列中 
// for+if判断
// function sort(arr) {
//     var len = arr.length
//     for (var i = 1; i < len; i++) {
//         var tmp = arr[i], pos=0 // 合适的位置下标
//         for (var j = i; j > 0; j--) {
//             if (tmp < arr[j-1]) {
//                 arr[j] = arr[j-1]
//             } else {
//                 pos = j
//                 break
//             }
//         }
//         arr[pos] = tmp
//         console.log('第' + (i + 1) + '次循环:', arr)
//     }
// }

// while
function sort(arr) {
    var len = arr.length
    for (var i = 1; i < len; i++) {
        var tmp = arr[i]
        var j = i-1
        while(j>=0 && arr[j]>tmp) {
            arr[j+1] = arr[j]
            j--
        }
        arr[j+1] = tmp 
        console.log('第' + (i + 1) + '次循环:', arr)
    }
}

var arr = [3,5,7,9,2,4,6,1,8]
sort(arr)
console.log(arr)
