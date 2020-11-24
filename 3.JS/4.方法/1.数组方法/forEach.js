const arr = [12,2,4,6,3]
let a = 1 
arr.forEach((item) => {
   item++
   a=a+item
})

const arr1 = [1,2,3,4]
const arr2 = [{a:1},{a:2},{a:3}]
arr1.forEach(item => item = item*item) //[1,2,3,4]
arr2.forEach(item => item.a = item.a * item.a)

console.log(a,arr); // 33 [ 12, 2, 4, 6, 3 ]
console.log(arr1,arr2) [ { a: 1 }, { a: 4 }, { a: 9 } ]

