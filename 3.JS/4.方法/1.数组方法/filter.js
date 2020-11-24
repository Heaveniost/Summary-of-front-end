const sunArr = [{
    id: '1',
    name: 'hurst',
    age: '20'
}, {
    id: '2',
    name: 'xingxing',
    age: '24'
}]

const newArr = sunArr.filter((item, index, arr) => item.age > 18)

console.log(newArr);