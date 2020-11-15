var n = {b:1}

var a = function(n) {
    n.b++
    console.log(n.b)

}

a(n)
console.log(n.b)