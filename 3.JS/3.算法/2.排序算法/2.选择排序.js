// 每次找一个最小元素放在已排好序的元素的后面 
function sort(arr) {
    var len = arr.length
    var min, tmp // 找出最小数的下标，与现有数组的后一位进行交换
    for (var i = 0; i < len - 1; i++) {
        min = i
        for (var j = i + 1; j < len; j++) {
            if (arr[j] < arr[min]) {
                min = j
            }
        }
        tmp = arr[min]
        arr[min] =arr[i]
        arr[i] = tmp
        console.log('第' + (i + 1) + '次循环:', arr)
    }
}

var arr = [3,5,7,9,2,4,6,1,8]
sort(arr)
console.log(arr)
