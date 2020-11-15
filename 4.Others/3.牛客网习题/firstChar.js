function FirstNotRepeatingChar(str)
{
    // write code here
    var a = []
    var b = []
    for(let i = 0; i < str.length;i++){
        var x = a.indexOf(str[i])
        if(x > -1) {
            b[x] = 0
        }else{
            a.push(str[i])
            b[a.length-1] = 1
        }
    }
    var y = b.indexOf(1)
    
    if(y > -1) {
        console.log(a[y])
    }else(
        console.log(false)
    )
}

var str = 'abcdeabcdf'
FirstNotRepeatingChar(str)
