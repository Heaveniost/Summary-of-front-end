function total(num){
    if(num<3){return 2}
    var sum = 0 
    for(var i=2; i<=num; i++){
        var flag = true 
        for(var j=2; j<i; j++){
            if(i % j == 0){
                flag = false
            }
        }
        if(flag){
            // console.log(j)
            sum += j
        }
    }
    return sum
}

console.log(total(20))