// 每次找一个最小元素放在已排好序的元素的后面 
function quickSort(arr) {
    var len = arr.length
    if(len<2) return arr
    var pivotkey = arr[0]
    var left = [], right = []
    
    for(var i=1; i<len; i++) {
        if(arr[i]<pivotkey) {
            left.push(arr[i])
        } else {
            right.push(arr[i])
        }
    }
    console.log(left,pivotkey,right)
    return quickSort(left).concat(pivotkey, quickSort(right))

}

var arr = [3,5,7,9,2,4,6,1,8]
var result = quickSort(arr) //注意，此时数组是有返回值的，原数组并没有改变 
console.log(result)
