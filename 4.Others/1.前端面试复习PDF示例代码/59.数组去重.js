function unique(arr) {
    var newArr = []
    for(var i=0; i<arr.length; i++) {
        if(newArr.indexOf(arr[i]) == -1){
            newArr.push(arr[i])
        }
    }
    return newArr
}

var arr = [1,2,3,4,5,6,4,3,2,1]
arr1 = Array.from(new Set(arr))
console.log(unique(arr),arr1,arr)