function sort(arr) {
    var oddNum = []
    var evenNum = []
    var newArr = []
    for(let i=0; i<arr.length; i++) {
        if(arr[i] % 2 == 0){
            evenNum.push(arr[i])
        }else{
            oddNum.push(arr[i])
        }
    }
    newArr = oddNum.concat(evenNum)
    console.log(newArr)
}

arr = [1,234,23,523,6,3,3246,3,42,4,6,7,8]
sort(arr)