// 将两个或两个以上的有序表合成一个新的有序表的过程  

function sort(arr) {
    var merge = function(left, right) {
        var final = []
        while(left.length && right.length) {
            final.push(left[0]<=right[0] ? left.shift() : right.shift())
        }
        return final.concat(left.concat(right))
    }

    var len = arr.length 
    if (len<2) return arr
    var mid = len/2
    return merge(sort(arr.slice(0, parseInt(mid))), sort(arr.slice(parseInt(mid))))
}

var arr = [3,5,7,9,2,4,6,1,8]
console.log(sort(arr))