//根据num的值升序排序
var list = [
    { id: 32, num: 5 },
    { id: 28, num: 12 },
    { id: 23, num: 9 }
]

list.sort(function(a,b){
    return a.num-b.num
})

console.log(list)