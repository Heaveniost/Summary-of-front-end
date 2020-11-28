// 先将要排序的一组记录按某个增量d（n/2,n为要排序数的个数）分成若干组子序列，每组中记录的下标相差d.
// 对每组中全部元素进行直接插入排序，然后再用一个较小的增量（d/2）对它进行分组，
// 在每组中再进行直接插入排序。继续不断缩小增量直至为1，最后使用直接插入排序完成排序。
function shellSort(arr) {
    var len = arr.length, tmp
    var gap = Math.floor(len / 2)

    while (gap >= 1) {
        var len = arr.length
        var tmp, gap
        for (var i = 1; i < len; i++) {
            for (var j = i; j >= gap; j = j-gap) {
                if (arr[j] < arr[j-gap]) {
                    tmp = arr[j]
                    arr[j] = arr[j-gap]
                    arr[j-gap] = tmp
                }
            }
        }
        console.log(arr)
        gap = Math.floor(gap/2)
    }
}

var arr = [3, 5, 7, 9, 2, 4, 6, 1, 8,23,12,31,25]
shellSort(arr)
console.log(arr)
