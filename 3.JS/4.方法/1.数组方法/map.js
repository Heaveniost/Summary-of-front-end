const array = [1, 2, 3, 4, 5];
const newArray = array.map((item) => {
    console.log(this)
    return item * item;
})
console.log(newArray)