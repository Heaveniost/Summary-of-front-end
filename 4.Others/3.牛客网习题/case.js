function show(value){
    switch(value){
        case 'a': 
            console.log('a')
            break
        case undefined:
            console.log('undefined')
            break
        default: 
            console.log('do not konw')
    }
}

show(new String('a'))
show('a')